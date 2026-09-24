# 進捗: 教育漢字さん（edu-kanji-checker）

## 2026-07-14 セッション

- **バグ/安全性**: 文脈スニペットとエラーメッセージを `innerHTML` へ挿入する前に
  `escapeHTML()` を通すよう修正（文書内の `<` `&` 等による表示崩れ・スクリプト混入を防止）。
- **デザイン統一**: `:root` に共通デザイントークン（背景/アクセント等）を導入し色を変数化。
  無効だった `noto-sans` 先頭のフォント指定を `system-ui`＋日本語フォントの実効スタックへ。
  ファイル入力ホバー色を共通アクセント(#f28c06)に統一、文脈表示の等幅フォントを本文フォントへ。
  `:focus-visible` リング・`prefers-reduced-motion` 対応・`theme-color` を追加。
- **SEO**: `og:image`（favicon）と `twitter:card` を追加（canonical/OGP/JSON-LD/sitemapは既存）。

## 2026-09-24 セッション（UI/デザイン改善）

- ファイル選択をドロップゾーンに（クリック・ドラッグ＆ドロップ・キーボード）。処理は `handleFile(file)` に集約。PDF の進行状況表示。
- 結果冒頭に学年別の分布（積み上げ横棒＋凡例）と合計字種数・出現回数。漢字ごとに出現回数バッジ、学年ごとに「この学年の漢字をコピー」。
- タブを WAI-ARIA Tabs パターンに（role/aria-selected、←→/Home/End）。学年色は棒用 `--g` と文字用 `--g-text`（濃い色）に分離。
- h1 を他ツールと同じ 18px に。判定ロジック（`getKanjiGrade`・分類）は変更なし。
- **共通**: 見出しの上に「edi-tool」（ハブへのリンク）、フッターに「← edi-tool ツール一覧」を追加。`--text-sub` を #6b6b6b に濃くし、文字用アクセント `--accent-text: #b35f00` を追加（WCAG AA）。

## 2026-09-24 セッション（第2弾: 印刷・OGP・改行）

- **印刷**: 分布の横に「全学年を印刷」ボタン。印刷時はタブを隠して全学年を順に出し、入力欄・ボタン・フッターを隠す。分布バーの色は `print-color-adjust: exact` で残す。
- **OGP**: 共有カード用の `ogp.png`（1200×630、Noto Sans JP で生成）を追加し、`og:image` をファビコンから差し替え、`twitter:card` を `summary_large_image` に。
- **改行**: body の `word-break: break-all` を `normal` + `overflow-wrap: anywhere` に変更。和文は従来どおり1字単位で折り返し、英単語（License、Word 等）は途中で割らない。

## 関連

- 組織ハブ: https://edi-tool.github.io/ （`edi-tool/edi-tool.github.io` リポジトリ）
