<script lang="ts">
	import type { Snippet } from 'svelte';
	import { logout } from '$lib/firebase/client.js';

	let { children, data } = $props<{
		children: Snippet;
	}>();
</script>

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
