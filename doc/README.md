## カスタムイベントについて

このアプリケーションで定義したカスタムイベントは以下
| カスタムイベント名 | 概要                          |
| ------------------ | ----------------------------- |
| onMenuOpen         | src/component/Menu が開いた時 |
| onMenuClose        | src/component/Menu が閉じた時 |

## テスト

- jest の際にコンソールエラーを出さないときは、tsconfig.jest.json でルールを緩くする

## その他

- Material-ui の elevation と z-index は合わせる

## CSS 命名ルール

### コンポーネント名

使い回しが予定される XXXX コンポーネントは

```
  <div className="AppXXXX-root"></div>
```

でラップし、親要素からは `AppXXXX-YYYY` でアクセスする
XXXX は BEM における Block、YYYY は BEM における Element と考える
