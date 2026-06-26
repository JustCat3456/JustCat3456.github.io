---
title: Ubuntu 26.04でのAntigravity IDEをtar.gzでインストールする方法
date: 2026-06-27
author: haruki saito
---

## エージェントファーストな開発環境「Antigravity IDE」

最近話題のGoogle Antigravity。みなさんはもう使ってみましたか？
Antigravityは、AIエージェントと一緒に協調して開発を行うための「エージェントファースト」な開発プラットフォームです。

スタンドアロンでエージェントを動かす「Antigravity 2.0」も強力ですが、やはりエディタ上でコードを書きながらエージェントとやり取りできる「Antigravity IDE」は非常に便利です。

今回は、最新の **Ubuntu 26.04 (LTS)** に Antigravity IDE をtar.gzでインストールする方法についてまとめます。

`2026/6/27`時点での話のため最新の情報はご自身でお確かめください。また、手っ取り早くインストールしたい方は `3.手動インストール` から読んでください

---

## 1. 注意点：UbuntuでのAntigravity IDEのインストールの問題点について

GoogleはAntigravity2.0を2026/5/19にリリースしましたが、その際にgoogle antigravity2.0とgoogle antigravity IDE(2.0)に分けてリリースするという破壊的変更を行いました。

今回は新しくインストールする方法についてまとますのでご了承ください。

また、googleはAntigravity 2.0においてtar.gz版のみのリリースしかしないようになりました。これは自分で環境構築を行う必要があり、しかも[公式サイトには古いドキュメントしかなく環境構築の方法が書かれていないという報告](https://discuss.ai.google.dev/t/update-linux-installation-documentation-for-antigravity-2-0-tarball-setup/146920)もあります。

chrome-sandboxが動かず `--no-sandbox` をつけないとうごかないなど環境によって様々ですのでその場合はご自身で適切な権限の付与を行うか、下のAntigravity cli に聞いてみてください。
 
---


## 2. CLIのみインストールする場合 (必須ではない)

もしGUI環境のIDEではなく、ターミナルからエージェントとやり取りするCLI（コマンドラインツール）だけが必要な場合は、以下の簡易スクリプトを使って一発でインストールできます。

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
```



> (もし、最悪下記の手動インストールでスタックした場合は 
> ```bash
> agy
> ```
> でAntigravity cliに修正してほしいと頼めます。)

---

## 3. 手動インストール（Tarball）



1. [antigravity.google/download](https://antigravity.google/download) にアクセスし、Linux用の `.tar.gz` ファイルをダウンロードします。

> **注意:**
> 動作には `glibc >= 2.28` および `glibcxx >= 3.4.25` が必要です。Ubuntu 26.04であれば標準で満たしているため問題ありません。

2. 任意の場所に解凍します。
   ```bash
   tar -zxvf antigravity-linux-x64.tar.gz
   ```

3. 解凍すると、以下のようなフォルダ・ファイル構成になります。

   ```text
   antigravity-linux-x64/
   ├── bin/
   ├── locales/
   ├── resources/
   ├── antigravity-ide  <--- これを使って起動する
   ├── chrome-sandbox
   ├── chrome_100_percent.pak
   ├── chrome_200_percent.pak
   ├── chrome_crashpad_handler
   ├── icudtl.dat
   ├── libEGL.so
   ├── libGLESv2.so
   ├── libffmpeg.so
   ├── libvk_swiftshader.so
   ├── libvulkan.so.1
   ├── resources.pak
   ├── snapshot_blob.bin
   ├── v8_context_snapshot.bin
   ├── vk_swiftshader_icd.json
   └── LICENSES.chromium.html
   ```

4. 解凍したディレクトリを `/opt/` ディレクトリに移動します（システム全体で共有するために `sudo` 権限が必要です）。
   ```bash
   sudo mv antigravity-linux-x64 /opt/antigravity-ide
   ```

5. 移動先のディレクトリに移動して、`antigravity-ide` を実行して起動します。
   ```bash
   cd /opt/antigravity-ide
   ./antigravity-ide
   ```

### オプション1：/usr/local/binにシンボリックリンクを作成(ターミナルから起動)

   また、どのディレクトリからでも簡単に起動できるように、`/usr/local/bin` にシンボリックリンクを作成しておくと便利です。
   ```bash
   sudo ln -s /opt/antigravity-ide/antigravity-ide /usr/local/bin/antigravity-ide
   ```
   作成後は、ターミナルで `antigravity-ide` と入力するだけで起動可能になります。


   ### オプション２：デスクトップランチャーを作成(デスクトップから起動)

普段通りGUIのアプリから立ち上げる方法は様々ありますが、今回は `/.local/share/applications/` にデスクトップエントリを作成します。(この場合アプリはユーザー個別のアプリとなります)

   まず、デスクトップエントリファイルを作成します。(※vimを使っていますがお好みのテキストエディタを使ってください e.g. nano, emacs, code ...)
   
   ```bash
   sudo vim ~/.local/share/applications/antigravity-ide.desktop
   ```
   
   開いたらそこに以下のように記述します。

   ```bash
   [Desktop Entry]
   Name=Antigravity IDE
   Exec=/opt/antigravity-ide/antigravity-ide
   Terminal=false
   Type=Application
   Icon=/opt/antigravity-ide/resources/antigravity.png
   Comment=AI-powered development environment
   Categories=Development;IDE;
   ```

   保存しapplicationを再起動します
   ```bash
   sudo systemctl restart applications
   ```

   これによりGUIのアプリ一覧にAntigravityのアイコンが追加されます

