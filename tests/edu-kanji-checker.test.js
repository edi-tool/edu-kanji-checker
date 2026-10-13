const { test } = require('node:test');
const assert = require('node:assert/strict');
const { read, load } = require('./helpers');

// README・学年別漢字配当表（平成29年告示）の字数
const EXPECTED = { 1: 80, 2: 160, 3: 200, 4: 202, 5: 193, 6: 191 };

function analyzer() {
  const out = {};
  const resultArea = { innerHTML: '' };
  const api = load({
    files: ['kanji-normalize.js', 'kanji_data.js'],
    functions: ['getKanjiGrade', 'analyzeKanji', 'escapeHTML'],
    exports: ['kanjiData', 'secondaryJoyoKanji', 'joyoKanjiTableForms', 'KANJI_GRADE_MAP'],
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

test('配当表にない常用漢字は 1,110 字で、配当表と合わせて常用漢字 2,136 字になる', () => {
  const { kanjiData, secondaryJoyoKanji, KANJI_GRADE_MAP } = analyzer();
  const secondary = Array.from(secondaryJoyoKanji);
  assert.equal(secondary.length, 1110);
  assert.equal(new Set(secondary).size, 1110);
  const edu = new Set(Object.values(kanjiData).flatMap((s) => Array.from(s)));
  assert.equal(secondary.filter((c) => edu.has(c)).length, 0, '配当表の字が混ざっている');
  // 2,136 字 + 常用漢字表の字体 4 字（塡・剝・頰・𠮟）
  assert.equal(KANJI_GRADE_MAP.size, 2136 + 4);
});

test('getKanjiGrade は学年、配当表にない常用漢字は joyo、表外字は other を返す', () => {
  const { getKanjiGrade } = analyzer();
  assert.equal(getKanjiGrade('一'), 1);
  assert.equal(getKanjiGrade('引'), 2);
  assert.equal(getKanjiGrade('論'), 6);
  assert.equal(getKanjiGrade('曖'), 'joyo');
  assert.equal(getKanjiGrade('剥'), 'joyo');
  assert.equal(getKanjiGrade('剝'), 'joyo');
  assert.equal(getKanjiGrade('薔'), 'other');
});

test('PDF 由来の部首用文字コードは通常の漢字として学年を判定する', () => {
  const { run } = analyzer();
  // U+2ED1 ⻑→長（小2）、U+2EA0 ⺠→民（小4）、U+2F00 ⼀→一（小1）、U+2ED8 ⻘→青（小1）
  const { gradeResults } = run('\u2ED1\u2EA0\u2F00\u2ED8');
  assert.deepEqual(Object.keys(gradeResults[1]).sort(), ['一', '青'].sort());
  assert.deepEqual(Object.keys(gradeResults[2]), ['長']);
  assert.deepEqual(Object.keys(gradeResults[4]), ['民']);
  assert.equal(Object.keys(gradeResults.other).length, 0);
});

test('文章中の漢字を学年ごとに分類し、出現回数をすべて数える', () => {
  const { run } = analyzer();
  const { gradeResults, counts } = run('一二一、曖昧な薔薇');
  assert.deepEqual(Object.keys(gradeResults[1]).sort(), ['一', '二'].sort());
  assert.deepEqual(Object.keys(gradeResults.joyo).sort(), ['昧', '曖'].sort());
  assert.deepEqual(Object.keys(gradeResults.other).sort(), ['薇', '薔'].sort());
  assert.equal(counts['一'], 2);
});

test('踊り字「々」「〻」と漢数字のゼロ「〇」は漢字として数えない', () => {
  const { run } = analyzer();
  const { gradeResults, counts } = run('山々と二〇二六年〻');
  assert.deepEqual(Object.keys(counts).sort(), ['二', '六', '山', '年'].sort());
  assert.deepEqual(Object.keys(gradeResults.other), []);
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

// Word から文字を 1 字も取り出せなかった場合（画像だけの文書など）
async function handleEmpty(extra = {}) {
  const els = { errorMsg: { textContent: '' }, resultArea: { innerHTML: '' } };
  let analyzed = false;
  const api = load({
    functions: ['handleFile'],
    globals: {
      document: { getElementById: (id) => els[id] },
      mammoth: { extractRawText: async () => ({ value: '  \n' }) },
      analyzeKanji: () => { analyzed = true; },
      console,
      ...extra,
    },
  });
  await api.handleFile({ name: 'a.docx', type: '', arrayBuffer: async () => new ArrayBuffer(0) });
  return { els, analyzed };
}

test('文字を取り出せなかったときは「該当なし」と表示せず、読み取り失敗として知らせる', async () => {
  const { els, analyzed } = await handleEmpty();
  assert.equal(analyzed, false);
  assert.match(els.errorMsg.textContent, /テキストを取り出せませんでした/);
  assert.doesNotMatch(els.resultArea.innerHTML, /見つかりませんでした/);
});
