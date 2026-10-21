# edu-kanji-checker

PDF・Word や入力された漢字が小学校の何年生で習うか（学年別漢字配当表）を判定・分類するブラウザツール。教育現場での資料作成やテキスト選定を想定。
公開URL: https://edi-tool.github.io/edu-kanji-checker/ （GitHub Pages）
共通方針は [edi-tool 開発原則](https://github.com/edi-tool/.github/blob/main/PRINCIPLES.md)。`CLAUDE.md` はこのファイルを取り込むだけなので、エージェント共通の規則はここに書く。

## 実行コマンド

- プレビュー: `python -m http.server 8000`
- 整形: `npx prettier --write .`
- テスト: `npm test`（Node.js 22 以上、依存なし）
- HTML 静的チェック: `npm run check`

## 守ること

- 極限の軽量化・高速化。JSライブラリは原則不使用（例外: PDF.js / Mammoth.js によるテキスト抽出）、ブラウザ標準機能優先。
- ファイルを外部送信しない（fetch 等がないことをテストで確認）。外部依存を増やしたら README「データの扱い」を更新する。
- 漢字データ（`kanji_data.js`）は文部科学省「学年別漢字配当表」（計1,026字）と、文化庁「常用漢字表」（2,136字。配当表にない1,110字を「中学〜」として区別）に基づく。変えたら出典と照合し、テストの字数と README を同時に更新する。
- `kanji-normalize.js`（部首用文字コードの置き換え）は kanji-checker と同じ内容。片方を直したらもう片方へもコピーする。
- PDF.js のバージョンは `index.html` 内の 3 か所（import・worker・`PDFJS_CMAP_URL`）と README をそろえる。
- `scripts/check-static.mjs` と `tests/helpers.js` は edi-tool/.github の templates からのコピー。直すときは原本も直す。
- 軽微な修正での push 禁止。ローカルサーバーで検証し、複数修正を1コミットに集約する（GitHub Actions 節約）。
- セッション終了時に `progress.md` を更新。
