# edu-kanji-checker

入力された漢字が小学校の何年生で習うか（学年別漢字配当表）を判定するツール。教育現場での資料作成やテキスト選定を想定。
公開URL: https://edi-tool.github.io/edu-kanji-checker/ （GitHub Pages）

## 実行コマンド

- プレビュー: `python -m http.server 8000`
- 整形: `npx prettier --write .`

## プロジェクト方針

- 極限の軽量化・高速化。JSライブラリは原則不使用（例外: PDF.js / Mammoth.js によるテキスト抽出）、ブラウザ標準機能優先。
- 漢字データ（`kanji_data.js`）は文部科学省「学年別漢字配当表」（計1,026字）に基づく。改変時は出典との整合を必ず確認。
- 軽微な修正での push 禁止。ローカルサーバーで検証し、複数修正を1コミットに集約（GitHub Actions 節約）。
- セッション終了時に `progress.md` を更新。
