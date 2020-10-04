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
