# edu-kanji-checker

入力された漢字が小学校の何年生で習うか（学年別漢字配当表）を判定するツール。教育現場での資料作成やテキスト選定を想定。
公開URL: https://edi-tool.github.io/edu-kanji-checker/ （GitHub Pages）

## 実行コマンド

- プレビュー: `python -m http.server 8000`
- 整形: `npx prettier --write .`
- テスト: `npm test` / HTML 静的チェック: `npm run check`

## プロジェクト方針

- 極限の軽量化・高速化。JSライブラリは原則不使用（例外: PDF.js / Mammoth.js によるテキスト抽出）、ブラウザ標準機能優先。
- 漢字データ（`kanji_data.js`）は文部科学省「学年別漢字配当表」（計1,026字）と、文化庁「常用漢字表」（2,136字。配当表にない1,110字を「中学〜」として区別）に基づく。改変時は出典との整合を必ず確認。
- `kanji-normalize.js`（部首用文字コードの置き換え）は kanji-checker と同じ内容。片方を直したらもう片方へもコピーする。
- PDF.js のバージョンは `index.html` 内の 3 か所（import・worker・`PDFJS_CMAP_URL`）と README をそろえる。
- 軽微な修正での push 禁止。ローカルサーバーで検証し、複数修正を1コミットに集約（GitHub Actions 節約）。
- セッション終了時に `progress.md` を更新。
