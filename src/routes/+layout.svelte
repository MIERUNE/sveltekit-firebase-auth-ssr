<script lang="ts">
	import type { Snippet } from 'svelte';
	import { logout } from '$lib/firebase/client';
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
	GitHub: <a href="https://github.com/MIERUNE/sveltekit-firebaseauth-ssr-stripe" target="_blank"
		>MIERUNE/sveltekit-firebaseauth-ssr-stripe</a
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
		<button onclick={logout} disabled={data.currentUser === undefined}>Logout</button>
	{/if}
</p>

{@render children()}
