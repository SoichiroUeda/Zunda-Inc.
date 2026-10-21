# Rism

睡眠を守るタスク管理アプリ「Rism」のアルファ版です。
何を作るかは [`docs/alpha_spec.md`](docs/alpha_spec.md) を見てください。

---

## はじめての準備（1 回だけ）

1. **Flutter をインストールする**
   公式の手順（<https://docs.flutter.dev/get-started/install>）で、自分の OS を選び、「Web」向けの準備まで進める。Chrome も必要。
   わからなければ、AI ツールに「Windows（または Mac）に Flutter を入れて Chrome で動かす手順を、初心者向けに教えて」と聞く。
2. **このリポジトリを自分のパソコンにコピー（クローン）する**
   ```
   git clone https://github.com/Rism-App/（リポジトリ名）.git
   cd （リポジトリ名）
   flutter pub get
   ```
3. **API キーのファイルを作る**
   リポジトリのいちばん上の階層に `dart_defines.json` というファイルを作り、次のように書く（キーはオーナーから個人 LINE で受け取る）。
   ```json
   {"GEMINI_API_KEY": "受け取ったキー"}
   ```
   このファイルは `.gitignore` に入っているので、GitHub には上がらない。**キーをほかの場所に書かないこと。**

## 動かし方

```
flutter run -d chrome --dart-define-from-file=dart_defines.json
```

## テスト

```
flutter test
```

## API キーが動くかの確認

**Mac（ターミナル）**

```
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent" -H "x-goog-api-key: ここにキー" -H "Content-Type: application/json" -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

**Windows（PowerShell）** 2 行に分かれています。1 行目のキーを書き換えて、両方まとめて貼り付ける。

```
$key = "ここにキー"
(Invoke-RestMethod -Method Post -Uri "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent" -Headers @{"x-goog-api-key"=$key} -ContentType "application/json" -Body '{"contents":[{"parts":[{"text":"Hello"}]}]}').candidates[0].content.parts[0].text
```

英語の返事が出れば成功。`429` が出たら無料枠の上限なので、少し時間をおく。

## 作業の流れ

1. 自分の担当を GitHub の Issues で確認する。
2. ブランチを作る（例：`it/input-screen`）。`main` に直接 push しない。
3. 作業したら Pull Request を出し、誰か 1 人に見てもらってからまとめる。
4. 作業した日は LINE グループに 1 行報告（仕様書 8.2）。

## 困ったら

1. まず自分の AI ツールに「このエラーを初心者向けに説明して」と聞く。
2. それでもだめなら LINE で相談。
   - 作り方（技術）の相談 → FT
   - 何を作るか（仕様）の相談 → オーナー（ぷらぐら）
   - 進め方・予定の相談 → 開発責任者（IT）
