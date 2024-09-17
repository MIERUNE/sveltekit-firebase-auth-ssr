# @mierune/sveltekit-firebase-auth-ssr

## Usage

1. 必要なもの：

   - Firebase プロジェクトの Project ID
   - Firebase プロジェクトの API Key
   - Firebase の（Google Cloudの）サービスアカウントキー

2. `src/hooks.client.ts` に以下のようなコードを加える。

   TODO

3. `src/hooks.server.ts` に以下のようなコードを加える。

   TODO

4. `src/app.d.ts` に以下のようなコードを加える。

   TODO

5. `src/routes/+layout.server.ts` に以下のようなコードを加える。

   TODO

6. 適切な場所でサインインとサインアウトを実装する。

7. 必要な場所でユーザ情報を利用する。

## 概要図

```mermaid
graph TB;
    subgraph "External"
        IDaaS["Firebase Auth"]
    end
    subgraph "SvelteKit (server)"
        Hooks[hooks.server.ts]
        Layout[routes/+layout.server.ts]
        Session["/session"]
        locals((locals))
    end
    subgraph "SvelteKit (universal)"
        Client["Browser"]
        Univ["+(layout|page).(svelte|ts)"]
        data((data))
    end
    IDaaS <--sign-in--> Client
    IDaaS --public key--> Hooks
    Client --with session cookie--> Hooks
    Hooks --currentUser--> locals --> Layout
    Hooks --> Session --Set-Cookie--> Client
    Layout --currentUser--> data
    data --> Univ
```
