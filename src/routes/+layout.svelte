<script lang="ts">
	import type { Snippet } from 'svelte';
	import { signOut } from '$lib/firebase-auth/client';
	import type { PageData } from './$types';

	let {
		data,
		children
	}: {
		data: PageData;
		children: Snippet;
	} = $props();
</script>

<p>
	GitHub: <a href="https://github.com/MIERUNE/sveltekit-firebase-auth-ssr" target="_blank"
		>MIERUNE/sveltekit-firebase-auth-ssr</a
	>
</p>

<ul>
	<li><a href="/">Home</a></li>
	<li><a href="/private">Private</a></li>
	<li><a href="/shop">Shop</a></li>
	{#if data.currentUser === undefined}
		<li><a href="/login">Login</a></li>
	{/if}
</ul>

<p>
	{#if data.currentUser !== undefined}
		<code>{JSON.stringify(data.currentUser)}</code>
		<button onclick={signOut} disabled={data.currentUser === undefined}>Logout</button>
	{/if}
</p>

{@render children()}
