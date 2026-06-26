# JustCat3456.github.io

個人ブログ・ポートフォリオサイトのソースコードリポジトリです。
GitHub Pages でホストされており、HTML、CSS、Vanilla JavaScript を使用したシンプルな静的サイト構成になっています。

## 特徴
- **フレームワーク非依存**: HTML、CSS、Vanilla JavaScript のみで構成された軽量なフロントエンド。
- **簡単記事追加**: Markdown ファイルを追加し、Python スクリプトを実行するだけで自動的に記事一覧へ登録されます。

## ディレクトリ構成
- `index.html` - メインページ
- `style.css` - スタイルシート
- `app.js` - ブログの表示および記事一覧（`BLOG_POSTS`）を定義する JavaScript
- `generate_posts.py` - `posts/` 内の Markdown 記事から `app.js` へ記事一覧の定義を同期する Python スクリプト
- `posts/` - Markdown 形式のブログ記事ファイル群

## 記事の追加・更新方法

1. **Markdown ファイルの作成**
   `posts/` ディレクトリ配下に、拡張子が `.md` の新規ファイルを作成します（例: `my-new-post.md`）。
   
2. **フロントマター（メタデータ）の記述**
   ファイルの先頭に以下の形式でメタデータを記述します。
   ```markdown
   ---
   title: 記事のタイトル
   date: 2026-06-27
   author: haruki saito
   ---

   （ここから本文を記述します）
   ```
   * ※ `date` が未指定の場合、Git のコミット履歴またはファイルの最終更新日時から自動取得されます。

3. **記事一覧の更新**
   リポジトリのルートディレクトリで以下の Python スクリプトを実行し、`app.js` を更新します。
   ```bash
   python3 generate_posts.py
   ```
   スクリプトを実行すると、`app.js` 内の `BLOG_POSTS` 配列が自動的に更新されます。

4. **デプロイ（デプロイは GitHub Pages が自動で行います）**
   作成した Markdown ファイルと、更新された `app.js` を Git でコミットし、リモートリポジトリへプッシュしてください。

## ローカルでの確認方法

静的サイトですので、ローカル環境で確認する場合は任意の簡易ローカルサーバーをご利用ください。

**Python を使用する場合:**
```bash
python3 -m http.server 8000
```
起動後、ブラウザで `http://localhost:8000` にアクセスして表示を確認できます。
