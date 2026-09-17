---
title: "JupytextとQuartoでドキュメント作成"
date: "2026-09-17"
description: ""
categories: ["jupytext", "quarto", "python"]
tags: [jupytext, quarto, python]
---

## Jupytext

### Jupytextとは

[Jupytext](https://jupytext.readthedocs.io/en/latest)はコードブロックで記載されたpythonスクリプトをJupyterNotebook形式に変換することができる。

### セル形式のPythonスクリプト

セル形式のPythonスクリプトとは、`# %%`でセルを区切る形式のPythonスクリプトのことである。
VSCodeはJupyterと組み合わせてインタラクティブな実行を可能とする。また、単純にスクリプトとしても実行できる。セル形式のスクリプトは次のように書くことができる。

```python
# ---
# title: "Markdown Example"
# date: "2026-03-01"
# ---

# %% [markdown]
# This is a multiline
# Markdown cell

# %%
# This is a code cell
class A():
    def one():
        ...
```

先頭の`#---`で囲われたブロックはメタデータを表し、Notebookのタイトルや日付などの情報を記述する。ここには以下で説明する、Jupytextの設定項目などを記述することもできる。ツールによって対応するが異なるようなので注意する。



### インストール

```bash
# uvでinstall
uv tool install jupytext
```

### 使い方

```bash
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
#     formats: ipynb,py:percent
#     text_representation:
#       format_name: percent
#   kernelspec:
#     name: example
#     language: python
#     display_name: example
# ---

# %% [markdown]
# This is a multiline
# Markdown cell

# %%
# This is a code cell
class A():
    def one():
        ...
```

`title`、`date`、`description`などはドキュメント自体の情報を表す。JupytextやJupyterの動作に関する設定は`jupyter`以下に記述する。

| 設定項目 | 設定例 | 説明 |
| --- | --- | --- |
| `jupytext.formats` | `ipynb,py:percent` | 同期するファイル形式を指定する。ここではNotebook形式とpercent形式のPythonスクリプトをペアにする。 |
| `jupytext.text_representation.format_name` | `percent` | テキスト形式でセルを表現する方法を指定する。`percent`では`# %%`をセルの区切りとして使用する。 |
| `kernelspec.name` | `financial-ts` | Jupyterが内部的に使用するカーネル名を指定する。実行環境に登録済みの名前を設定する。 |
| `kernelspec.language` | `python` | カーネルが実行するプログラミング言語を指定する。 |
| `kernelspec.display_name` | `financial-ts` | Jupyterの画面に表示されるカーネル名を指定する。 |

#### Notebookとの同期

`formats`に`ipynb,py:percent`を指定すると、同じ名前の`.py`と`.ipynb`がペアになる。

```yaml
jupyter:
  jupytext:
    formats: ipynb,py:percent
```

例えば、`hoge.py`と`hoge.ipynb`を同期するには次のコマンドを実行する。片方のファイルが存在しない場合は新しく作成され、両方が存在する場合は更新された側の入力セルがもう一方に反映される。実行結果や画像などの出力は`.ipynb`側に保持される。

```bash
jupytext --sync hoge.py
```

JupytextをJupyter環境に導入している場合は、ペアになったNotebookをJupyter上で保存したときにも両方のファイルが更新される。`.ipynb`と同期せず、必要なときだけ変換する場合は、`formats`から`ipynb`を外すか、`formats`を省略して`jupytext --to notebook hoge.py`を実行する。

#### セルの区切り

| 記法 | セルの種類 | 説明 |
| --- | --- | --- |
| `# %% [markdown]` | Markdownセル | 以降のコメント行をMarkdownセルとして扱う。 |
| `# %%` | コードセル | 新しいコードセルの開始位置を示す。 |

---

## Quarto

### Quartoとは

[Quarto](https://quarto.org)はMarkdownを拡張した`.qmd`フォーマットで記載されたファイルを実行してHTMLやWord, PDFなどに変換することができるツール。JupyerNotebook形式(`.ipynb`)にも対応しているため、Jupytextと組み合わせることで`.py`ファイルから`.ipynb`または`.qmd`に変換し、その後QuartoでHTMLなどの対応する任意の出力フォーマットとして出力することができます。

個人的にこの組み合わせが良いと思っている点は、実行時はpythonファイルの方が取り回しが良いところです。フォーマットさえ設定しておけば、すぐにきれいな可視化出力が可能になるので実験レポートなどの作成との相性がいいと思います。また、Quartoはスライド作成にも対応している点や最近話題の組版システムである[Typst](https://typst.app)との連携等も今後試していきたいと考えています。

### インストール

`uv`を使う場合は、PyPIで公開されている`quarto-cli`パッケージを指定する。`quarto`ではなく`quarto-cli`である点に注意する。

```bash
uv tool install quarto-cli
```

### 使い方
```bash
# デフォルトはHTML出力
quarto render report.qmd
# --toオプションでフォーマットを直接指定する
quarto render report.qmd --to pdf

# --executeオプションを付けると実行出力が可能
quarto render report.qmd --to html --execute

# ipynbをHTMLに変換
quarto render report.ipynb --to html
```

**Quartoでpyファイルを直接変換する場合の注意点**

Quartoで `.py` ファイルを直接レンダリングする場合は、ファイルの先頭を `# %% [markdown]` で始め、そのセル内にYAMLヘッダーを記述する。

```python
# %% [markdown]
---
title: "title"
date: "2026-01-01"
---
```


## メモ

`jupytext`および`quart(quarto-cli)`のインストール方法は`uv`を使ったインストール方法を前提としています。他のインストール方法などは公式ページ等を参照してください。
