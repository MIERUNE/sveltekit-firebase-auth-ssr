<script lang="ts">
	import { login } from '$lib/firebase/client.js';
	import { page } from '$app/stores';

	let { data } = $props();
</script>

<h1>Login</h1>

{#if $page.url.searchParams.get('next')}
	<p>ログインが必要です</p>
{/if}

<button onclick={login} disabled={data.currentUser !== undefined}>Sign-in with Google</button>
