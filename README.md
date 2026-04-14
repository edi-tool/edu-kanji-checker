# 漢字学習学年判定ツール

入力された漢字が、小学校の何年生で習うもの（学年別漢字配当表）かを判定して出力するツールです。

https://edi-tool.github.io/edu-kanji-checker/

## 概要
文部科学省の学習指導要領に基づき、漢字の習得学年を特定します。
教育現場での資料作成や、お子様の学習状況に合わせたテキストの選定などに活用いただけます。

## 使用技術

- **Core**: Vanilla JavaScript (ES6+)
- **Libraries**:
  - [PDF.js](https://mozilla.github.io/pdf.js/) (PDFテキスト抽出)
  - [Mammoth.js](https://github.com/mvoloskov/mammoth.js) (.docxテキスト抽出)

## 漢字データの出典

本ツールが判定に使用している学年別漢字データは、以下の公的資料に基づいています。

- **文部科学省「学年別漢字配当表」**（小学校学習指導要領 附録）
  - 第1学年：80字
  - 第2学年：160字
  - 第3学年：200字
  - 第4学年：202字
  - 第5学年：193字
  - 第6学年：191字
  - **合計：1,026字**

## 仕様上の注意
- **人名・地名**: 常用外漢字や、配当外の読み方であっても漢字自体が教育漢字であれば、その学年として判定されます。
- **解析制限**: 画像化されたPDF（スキャンデータ）や、パスワード保護されたファイルは解析できません。
- **プライバシー**: 読み込んだファイルの内容が外部サーバーに送信されることはありません。すべての解析はブラウザ内で完結します。

## 参考文献 / References

本プロジェクトの開発にあたり、以下の資料およびデータを参照・利用させていただきました。

### 公的資料
* [小学校学習指導要領（平成29年告示）解説 国語編](https://www.mext.go.jp/a_menu/shotou/new-cs/youryou/syo/koku/__icsFiles/afieldfile/2016/10/27/1234920.pdf) - 文部科学省
  * 漢字配当表の公式基準として参照

### データ・リポジトリ
* [mimneko/kanji-data](https://github.com/mimneko/kanji-data)
  * 漢字データの構造化におけるベースデータとして利用
* [学年別漢字配当表に基づく漢字データベース](https://denki.nara-edu.ac.jp/~yabu/edu/kanji/kanji3.html) - 藪 哲郎（奈良教育大学）
  * 漢字情報のクロスチェックおよび補足データとして参照

### システム
* [Mammoth.js](https://github.com/mvoloskov/mammoth.js) 
  * 本ツールのシステムの参考

### デザイン
* [kzhrknt/awesome-design-md-jp](https://github.com/kzhrknt/awesome-design-md-jp)
  * 本ツール（index）のデザインの参考

---
© 2026 ISHIKAWA, Natsuki
