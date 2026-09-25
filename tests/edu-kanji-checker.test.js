const { test } = require('node:test');
const assert = require('node:assert/strict');
const { read, load } = require('./helpers');

// README・学年別漢字配当表（平成29年告示）の字数
const EXPECTED = { 1: 80, 2: 160, 3: 200, 4: 202, 5: 193, 6: 191 };

function analyzer() {
  const out = {};
  const resultArea = { innerHTML: '' };
  const api = load({
    files: ['kanji_data.js'],
    functions: ['getKanjiGrade', 'analyzeKanji', 'escapeHTML'],
    exports: ['kanjiData'],
    globals: {
      renderResults: (gradeResults, counts) => Object.assign(out, { gradeResults, counts }),
      document: { getElementById: () => resultArea },
    },
  });
  return {
    ...api,
    resultArea,
    run: (text) => {
      delete out.gradeResults;
      api.analyzeKanji(text);
      return out;
    },
  };
}

test('学年別の字数が配当表どおりで、合計 1,026 字', () => {
  const { kanjiData } = analyzer();
  let total = 0;
  for (const [grade, n] of Object.entries(EXPECTED)) {
    const chars = Array.from(kanjiData[grade]);
    assert.equal(chars.length, n, `第${grade}学年`);
    assert.equal(new Set(chars).size, n, `第${grade}学年に重複がある`);
    total += n;
  }
  assert.equal(total, 1026);
});

test('同じ漢字が複数の学年に入っていない', () => {
  const { kanjiData } = analyzer();
  const all = Object.values(kanjiData).flatMap((s) => Array.from(s));
  assert.equal(new Set(all).size, all.length);
});

test('getKanjiGrade は学年、配当外は other を返す', () => {
  const { getKanjiGrade } = analyzer();
  assert.equal(getKanjiGrade('一'), 1);
  assert.equal(getKanjiGrade('引'), 2);
  assert.equal(getKanjiGrade('論'), 6);
  assert.equal(getKanjiGrade('薔'), 'other');
});

test('文章中の漢字を学年ごとに分類し、出現回数をすべて数える', () => {
  const { run } = analyzer();
  const { gradeResults, counts } = run('一二一、薔薇');
  assert.deepEqual(Object.keys(gradeResults[1]).sort(), ['一', '二'].sort());
  assert.deepEqual(Object.keys(gradeResults.other).sort(), ['薇', '薔'].sort());
  assert.equal(counts['一'], 2);
});

test('文脈は前後 12 文字・1 字につき最大 5 件', () => {
  const { run } = analyzer();
  const pad = 'あ'.repeat(20);
  const one = [...run(`${pad}一${pad}`).gradeResults[1]['一']][0];
  assert.equal(one.length, 25);
  const many = Array.from({ length: 8 }, (_, i) => `${'い'.repeat(i + 1)}一`).join('。');
  const { gradeResults, counts } = run(many);
  assert.equal(gradeResults[1]['一'].size, 5);
  assert.equal(counts['一'], 8);
});

test('漢字がないときは「見つかりませんでした」と表示する', () => {
  const { run, resultArea } = analyzer();
  assert.equal(run('ひらがなだけ').gradeResults, undefined);
  assert.match(resultArea.innerHTML, /漢字が見つかりませんでした/);
});

test('escapeHTML は HTML の特殊文字を無害化する', () => {
  const { escapeHTML } = analyzer();
  assert.equal(escapeHTML(`<b>"&'</b>`), '&lt;b&gt;&quot;&amp;&#39;&lt;/b&gt;');
});

test('ファイル内容を外部へ送信するコードがない', () => {
  assert.doesNotMatch(read('index.html'), /\bfetch\(|sendBeacon|XMLHttpRequest|WebSocket/);
});
