---
title: "JupytextとQuartoで実験管理"
date: "2026-03-08"
description: ""
categories: ["jupytext", "quarto", "python"]
tags: [jupytext, quarto, python]
published: false
---

## Jupytext

https://jupytext.readthedocs.io/en/latest

**jupytextとは？**

コードブロックで記載されたpythonスクリプトをJupyterNotebook形式に変換することができる

```bash
pip install jupytext

# notebookに変換する
jupytext --to notebook --execute hoge.py
```

**設定**

設定は`jupytext.toml`をプロジェクトルートに配置するか、Markdownヘッダーに専用のオプションを記述することで適用する。

```python
# ---
# title: "Markdown Example"
# date: "2026-03-01"
# description: "description here"
# categories: ["python", "fastapi"]
# jupyter:
#   jupytext:
#			formats: py:percent
#     text_representation:
#       format_name: percent
#   kernelspec:
#     name: financial-ts
#     language: python
#     display_name: financial-ts
# ---
```

## Quarto

qmdというMarkdownを拡張したフォーマットで記載されたファイルを実行してhtmlやdoc, pdfなどに変換することができるツール

```bash
# デフォルトはHTML出力
quarto render report.qmd
# --toオプションでフォーマットを直接指定する
quarto render report.qmd --to pdf

# --executeオプションを付けると実行出力が可能
quarto render report.qmd --to html --execute
```

qmdやipynbにMarkdown形式のヘッダーにオプションなどを指定することで、実行環境や出力フォーマットを指定することができる

**JupytextとQuartoを併用するうえでの注意**

**Quartoでpyファイルを直接変換する場合**

Quartoでpyファイルを直接変換する場合に、コメントには`# %% [markdown]`をつけないとヘッダーを認識することができない。なので、面倒な場合はjupytextで一度qmdまたはipynbに変換したものをquartoでレンダリングするのが楽。

```bash
# %% [markdown]
---
title: "title"
date: "2026-01-01"
---
```
