---
title: "JupytextとQuartoでドキュメント作成"
date: "2026-09-17"
description: ""
categories: ["jupytext", "quarto", "python"]
tags: [jupytext, quarto, python]
---

## Jupytext

### Jupytextとは

[Jupytext](https://jupytext.readthedocs.io/en/latest)は、Jupyter NotebookをPythonスクリプトやMarkdownなどのテキスト形式に変換し、必要に応じて相互に同期できるツールである。

### セル形式のPythonスクリプト

セル形式のPythonスクリプトとは、`# %%`でセルを区切る形式のPythonスクリプトのことである。
VS CodeはJupyterと組み合わせてインタラクティブに実行できる。また、通常のPythonスクリプトとしても実行できる。セル形式のスクリプトは次のように記述する。

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
class A:
    def one(self):
        ...
```

先頭の`# ---`で囲まれたブロックはメタデータを表し、Notebookのタイトルや日付などの情報を記述する。ここには、以下で説明するJupytextの設定項目も記述できる。ツールによって対応する項目が異なるため注意する。



### インストール

```bash
# CLIとしてインストール
uv tool install jupytext
```

Jupyter上でファイルを保存したときに自動同期する場合は、Jupyterを実行するPython環境にJupytextをインストールする。

```bash
python -m pip install jupytext
```

### 使い方

```bash
# Notebookに変換する
jupytext --to notebook hoge.py

# Notebookに変換してセルを実行する
jupytext --to notebook --execute hoge.py
```

**設定**

プロジェクト全体に設定を適用する場合は、プロジェクトルートに`jupytext.toml`を配置する。

```toml
formats = "ipynb,py:percent"
```

ファイルごとに設定する場合は、Pythonスクリプト先頭のYAMLヘッダーにオプションを記述する。

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
#     name: python3
#     language: python
#     display_name: Python 3
# ---

# %% [markdown]
# This is a multiline
# Markdown cell

# %%
# This is a code cell
class A:
    def one(self):
        ...
```

`title`、`date`、`description`などはドキュメント自体の情報を表す。JupytextやJupyterの動作に関する設定は`jupyter`以下に記述する。

| 設定項目 | 設定例 | 説明 |
| --- | --- | --- |
| `jupytext.formats` | `ipynb,py:percent` | 同期するファイル形式を指定する。ここではNotebook形式とpercent形式のPythonスクリプトをペアにする。 |
| `jupytext.text_representation.format_name` | `percent` | テキスト形式でセルを表現する方法を指定する。`percent`では`# %%`をセルの区切りとして使用する。 |
| `kernelspec.name` | `python3` | Jupyterが内部的に使用するカーネル名を指定する。実行環境に登録済みの名前を設定する。 |
| `kernelspec.language` | `python` | カーネルが実行するプログラミング言語を指定する。 |
| `kernelspec.display_name` | `Python 3` | Jupyterの画面に表示されるカーネル名を指定する。 |

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

[Quarto](https://quarto.org)は、Markdownを拡張した`.qmd`ファイルを実行し、HTMLやWord、PDFなどへ変換できるツールである。Jupyter Notebook形式（`.ipynb`）にも対応しているため、Jupytextと組み合わせることで、`.py`ファイルを`.ipynb`または`.qmd`に変換し、Quartoが対応する任意の形式で出力できる。

個人的にこの組み合わせが良いと思っている点は、実行時はPythonファイルの方が取り回しやすいことである。フォーマットを設定しておけば、きれいな可視化結果をすぐに出力できるため、実験レポートなどの作成とも相性が良い。また、Quartoはスライド作成や、組版システムである[Typst](https://typst.app)との連携にも対応している。

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

# 保存済みの実行結果を使ってipynbをHTMLに変換
quarto render report.ipynb --to html

# セルを再実行してからHTMLに変換
quarto render report.ipynb --to html --execute
```

**Quartoで`.py`ファイルを直接レンダリングする場合の注意点**

Quartoで `.py` ファイルを直接レンダリングする場合は、ファイルの先頭を `# %% [markdown]` で始め、そのセル内にYAMLヘッダーを記述する。

```python
# %% [markdown]
# ---
# title: "title"
# date: "2026-01-01"
# ---
```


## メモ

JupytextおよびQuartoには、本文で紹介した方法以外にもインストール方法がある。Jupyterとの連携を利用する場合は、JupyterとJupytextを同じPython環境にインストールする必要がある。詳細はそれぞれの公式ページを参照すること。
