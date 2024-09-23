# @mierune/sveltekit-firebase-auth-ssr

![NPM Version](https://img.shields.io/npm/v/%40mierune%2Fsveltekit-firebase-auth-ssr)

SvelteKit に Firebase Authentication による認証を組みこむためのパッケージです。Server-Side Rendering (SSR) 専用です。

Node.js 環境だけでなく、Cloudflare Pages/Workers 単独でも動作するように実装されています。

## Usage

1. 用意するもの：

   - Firebase プロジェクトの Project ID
   - Firebase プロジェクトの API Key
   - Firebase の（Google Cloudの）サービスアカウントキー

2. `src/hooks.client.ts` にコードを加える。例）TODO 
3. `src/hooks.server.ts` にコードを加える。例）TODO 
4. `src/app.d.ts` にコードを加える。例）TODO 
5. `src/routes/+layout.server.ts` にコードを加える。例）TODO 
6. 適切な場所でサインインとサインアウトを実装する。例）TODO 
7. 必要な場所でユーザ情報を利用する。
8. 必要な環境変数を、実行環境に忘れずに設定する。
