<script lang="ts">
	import { signInWithGoogle, waitForRedirectResult } from '$lib/firebase-auth/client';
	import { page } from '$app/stores';

	const redirectResult = waitForRedirectResult();

	let { data } = $props();
</script>

<h1>Login</h1>

{#await redirectResult}
	loading...
{:then result}
	{#if !result}
		{#if $page.url.searchParams.get('next')}
			<p>ログインが必要です</p>
		{/if}
		<button onclick={signInWithGoogle} disabled={data.currentIdToken !== undefined}
			>Sign-in with Google</button
		>
	{/if}
{/await}
