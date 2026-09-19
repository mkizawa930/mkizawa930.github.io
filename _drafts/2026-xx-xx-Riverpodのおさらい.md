---
title: "Riverpodのおさらい”
date: "2026-xx-xx"
description: ""
published: false
---

## Riverpodとは

[Riverpod](https://riverpod.dev/ja/)とはFlutterの状態管理用のフレームワーク。

## Providerについて

- Provider
  - 読み取り専用のプロバイダ
- FutureProvider
  - Futureを返す読み取り専用のプロバイダ
  - APIから取得したデータをキャッシュする
- StateProvider
  - 状態を変更可能なプロバイダ
- StreamProvider
  - Streamを返すプロバイダ

```dart

final countProvider = StateProvider((ref) => 0);

class SomeWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ref.watchで状態を監視、値が変更されたら関連ウィジェットが再ビルドされる
    final String count = ref.watch(countProvider);

    return Center(
        child: Text('$count'), // countが変わったらテキストが再ビルドされる
    );
  }
}
```

## Notifierについて

### Notifier

Notifierは状態と状態を変更するメソッドをまとめたクラスです。

```dart

class TodosNotifier extends Notifier<List<Todo>> {

    @override
    List<Todo> build() {
        return [];
    }

    Future<void> addTodo(Todo todo) async {
        // ...
    }

}

```

### AsyncNotifier

**`AsyncValue`とは**

[AsyncValue](https://pub.dev/documentation/riverpod/latest/riverpod/AsyncValue-class.html)はsealedクラスで、実際の値はサブクラスの`AsyncData`, `AsyncLoading`, `AsyncError`で表現されます。

```dart
final state = ref.watch(someFutureProvider); // AsyncValue<T>を返すプロバイダ

// AsyncValueはいくつかのアクセスメソッドなどを提供する
// state.hasValue: 値があるか
// state.requireValue: 値がセットされていない場合に例外を投げる
//

// 一般的にはwhenまたはmaybeWhenメソッドでパターンマッチを使う
return state.when(

);




```

### `WidgetRef`について

`ref.watch`

- ProviderまたはNotifierの状態を監視する
- buildメソッド内では基本的にこれを使用する

`ref.read`

- ProviderまたはNotifierの状態を取得する
- イベントコールバックなどの一時的な値の読み取りの際に使用する

`ref.listen`

- ProviderまたはNotifierの状態の変更時に副作用を実行する
- 基本的にConsumerWidgetのbuildメソッドで登録する

```dart
// ConsumerWidgetのbuildメソッド
Widget build(BuildContext context, WidgetRef ref) {

    ref.listen(countProvider, (prev, next) async {
        if (next > 10) {
            debugPrint('10より大きい値になりました');
        }
    });


    return ...
}

```

## 失敗した例

### 意図しない状態のキャッシュ

FutureProviderはAPIなどの非同期的な値の取得をキャッシュするために使いますが、うっかりキャッシュさせたくないケースでもFutureProviderを経由してしまっていたことにより、古い状態をずっと参照してしまっていたというケースがありました。基本的に`.autoDispose`をつかって自動でDisposeさせたほうが事故が少なくなると思います。AutoDisposeにすると、Widgetが参照されなくなったタイミングでProviderが破棄されます。

```dart

Future<void> setup() async {

    final val = await ref.read(hogeProvider.future);

}

```

### 副作用を複雑にしすぎない

TODO

###
