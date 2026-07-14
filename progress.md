# 進捗: 教育漢字さん（edu-kanji-checker）

## 2026-07-14 セッション

- **バグ/安全性**: 文脈スニペットとエラーメッセージを `innerHTML` へ挿入する前に
  `escapeHTML()` を通すよう修正（文書内の `<` `&` 等による表示崩れ・スクリプト混入を防止）。
- **デザイン統一**: `:root` に共通デザイントークン（背景/アクセント等）を導入し色を変数化。
  無効だった `noto-sans` 先頭のフォント指定を `system-ui`＋日本語フォントの実効スタックへ。
  ファイル入力ホバー色を共通アクセント(#f28c06)に統一、文脈表示の等幅フォントを本文フォントへ。
  `:focus-visible` リング・`prefers-reduced-motion` 対応・`theme-color` を追加。
- **SEO**: `og:image`（favicon）と `twitter:card` を追加（canonical/OGP/JSON-LD/sitemapは既存）。

## 関連

- 組織ハブ: https://edi-tool.github.io/ （`edi-tool/edi-tool.github.io` リポジトリ）
