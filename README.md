# sveltekit-firebaseauth-ssr

SvelteKit (Svelte 5, SSR) + Firebase Authentication の統合デモ

## 実行方法

環境変数 `GOOGLE_SERVICE_ACCOUNT_KEY` で Firebase プロジェクトのサービスアカウントキーファイル (JSON) の中身を渡すこと。

```bash
cp .env.example .env

# 内容を編集

npm run dev
```

## 仕組み

1. 認証ガードを行うため、`hooks.server.ts` の時点で Cookie を検証しておく必要がある。得られたユーザ情報は locals で次に渡す。
2. locals のユーザ情報を `routes/+layout.server.ts` で data に変換する。
    - これにより、ユーザ情報はそのレイアウト以下のすべての `routes/**/+page.svelte`, `routes/**/+layout.svelte` で、 `data` として参照できる。


## Known issues

- Cloudflare Pages/Workers では、`firebase-admin` とNode.js互換モードの相性が悪くて動かない。
