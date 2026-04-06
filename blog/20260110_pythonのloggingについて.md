---
title: Pythonのloggingについて
date: 2026-01-10
description: "Pythonのloggingモジュールの基本的な使い方、ロガーの親子関係、セットアップ方法について解説します"
---

# Pythonのloggingについて

## 基本的な使用方法

```python
import logging

# StreamHandlerが追加される
logging.basicConfig(level=logging.INFO)


# ルートロガーを取得
logger = logging.getLogger()
logger.info("hoge") # コンソールに出力される
logger.debug("fuga") # info未満は出力されない

print(logger.handlers) # [<StreamHandler <stderr> (NOTSET)>]
```

logging.debug/info/warning/error/criticalなどのグローバル関数を呼び出すと、ルートロガーにハンドラーがない場合、内部でbasicConfigが自動的に呼ばれてデフォルトのハンドラーが設定されるため注意する

```python
import logging

logging.error("error") # ルートロガーにハンドラーがない場合、デフォルトのハンドラーが設定される

logging.basicConfig(level=logging.INFO) # すでにハンドラーが設定済みのため何もしない
logger = logging.getLogger()
logger.info("info")

# forceをTrueにすれば上書きされる
logging.basicConfig(level=logging.INFO, force=True)

```

## loggerの親子関係

- getLogger関数はルートロガーまたは名前付きロガーを返す
- 名前付きロガーには親子関係がある
  - 名前のドット区切りで親子関係が作られる
  - 子のロガーを呼び出すと、親のロガーのハンドラーも順次呼び出される

ロガーの親子関係

```
RootLogger
└─ Logger("hoge")
      └─ Logger("hoge.fuga")
```

子のLoggerから親を呼び出したくない場合は、セットアップ時に`propagate`プロパティを指定する

> **注意**: `propagate = False` にすると、そのロガー自身にハンドラーが設定されていない場合、ログがどこにも出力されなくなる

```python
from logging import getLogger

logger = getLogger(__name__)
logger.propagate = False # 親のhandlersを呼び出さない
```

## 特定のロガーの設定

- 基本的にはRootロガーに想定する共通のハンドラーをセットアップする(セットアップはアプリケーション側で一度だけ初期化するのが望ましい)
- 各呼び出し元のモジュールで`getLogger(__name__)`として名前付きロガーを作成して、モジュール単位で管理するのが良い

```python
# my_logging.py
import logging
from logging import getLogger, StreamHandler, Logger, Formatter

# 名前付きロガーのセットアップ（同じ名前で複数回呼ばれてもハンドラーが重複しないようにガードしている）
def setup_logger(name: str, level: int = logging.INFO) -> Logger:
    logger = getLogger(name)
    logger.setLevel(level)

    # すでにハンドラーが追加されている場合
    if logger.handlers:
        return logger

    stream_handler = StreamHandler()
    formatter = Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)

    return logger
```
