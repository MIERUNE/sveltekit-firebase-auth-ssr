<script lang="ts">
	import { login, waitForRedirectResult } from '$lib/firebase/client.js';
	import { page } from '$app/stores';

	const redirectResult = waitForRedirectResult();

	let { data } = $props();
</script>

<h1>Login</h1>

{#await redirectResult}
	loading...
{:then result}
	{#if result === null}
		{#if $page.url.searchParams.get('next')}
			<p>ログインが必要です</p>
		{/if}
		<button onclick={login} disabled={data.currentUser !== undefined}>Sign-in with Google</button>
	{/if}
{/await}
