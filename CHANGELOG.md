# Changelog

このプロジェクトの主な変更を記録します。形式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/)、
バージョンは [Semantic Versioning](https://semver.org/lang/ja/) に従います。
1.x 以前の履歴は、この CHANGELOG を作成した時点で Git の履歴からまとめ直したものです。

## [Unreleased]

### Added

- テスト（`npm test`）と HTML 静的チェック（`npm run check`）、GitHub Actions の CI
- README に使い方・データの扱い・制限事項・関連ツール・画面例を追記

### Changed

- 開発用ファイル（CLAUDE.md・progress.md・tests など）を GitHub Pages の公開ビルドから除外

## [1.3.0] - 2026-09-25

### Changed

- SEO：タイトルをキーワード先頭に、説明文と構造化データを拡充、og:site_name を追加

## [1.2.0] - 2026-09-24

### Added

- ドロップゾーン、学年別の分布バー、出現回数、タブのキーボード操作
- 全学年の印刷、共有用 OGP 画像

## [1.1.1] - 2026-07-15

### Security

- PDF.js を脆弱性修正版へ更新

## [1.1.0] - 2026-04-16

### Changed

- パフォーマンス・SEO・アクセシビリティの改善、エラー表示と文脈表示の改善

## [1.0.0] - 2026-04-14

- 初回公開：PDF・Word 内の漢字を学年別漢字配当表に基づいて分類
