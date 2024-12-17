---
title: Linuxディストリビューションについての話
author: haruki saito
---

これは琉大アドベントカレンダー2024の記事です。

# Do you know Linux?

Linux は、UNIX系のオペレーティングシステムの一つです。Linux は、オープンソースのソフトウェアであり、無料で利用できます。Linux は、多くのディストリビューションがあります。ディストリビューションとは、Linux カーネルに、システムユーティリティやアプリケーションソフトウェア、デスクトップ環境などを組み合わせたものです。
近年、はdockerやwslなどで聞いたことがあるかもしれません。
今回は、GuiのLinuxビギナー向けに、Linuxディストリビューションについての話をします。

# Linuxの基礎知識

Linux(Gui) = Linuxカーネル + デスクトップ環境 

Linux(Gui)のOSは2種類から構成されていて、まずはOSのCUI部分であるLinuxカーネルと、OSのGUI部分であるデスクトップ環境があります。Linuxカーネルは、Linuxの基本的な機能を提供する部分で、デスクトップ環境は、Linuxの操作をGUIで行うための部分です。

# メジャーなLinuxカーネル

- debian:有名 apt
- Fedora:redhut社 yum
- Ubuntu:debianの派生 apt
- Arch:コマンドが気持ち悪いのが特徴(変態的軽量) pacman -Syu

# メジャーなデスクトップ環境

- GNOME:macに似たデザイン ubuntuにデフォルト採用
- KDE:Windowsに似たデザイン 昔は重かったのに最近では軽くなった
- Xfce:軽量デスクトップ環境
- LXDE:軽量デスクトップ環境
- MATE:軽めのデスクトップ環境 GNOME2のフォーク
- Cinnamon:Windowsに似たデザイン Linux Mintにデフォルト採用

# おすすめのLinuxディストリビューション

まずは[Distro watch](https://distrowatch.com/)にアクセスしてみてOSを選んでみましょう。

個人的には[KDE neon](https://neon.kde.org/)が好きです。Ubuntuとkdeを組み合わせたディストリビューションです。軽量でaptで使いやすいです。

Archが好きなら[Manjaro](https://manjaro.org/)や[Endeavour OS](https://endeavouros.com/)を使ってみましょう。拡張性が高いです。

# まとめ

さあ、Linuxを使おう！