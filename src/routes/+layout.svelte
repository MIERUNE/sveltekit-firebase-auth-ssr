<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getAuth, sendEmailVerification } from 'firebase/auth';
	import { signOut } from '$lib/firebase-auth/client';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	let {
		data,
		children
	}: {
		data: PageData;
		children: Snippet;
	} = $props();

	async function _sendEmailVerification() {
		const auth = getAuth();
		if (auth.currentUser) {
			await sendEmailVerification(auth.currentUser, { url: $page.url.origin + '/verify_email' });
			alert('Verification email sent!');
		}
	}
</script>

{#if data.currentIdToken !== undefined}
	<p>
		Current User: <code>{JSON.stringify(data.currentUser)}</code>
		<button onclick={signOut} disabled={data.currentUser === undefined}>Logout</button>
	</p>
	{#if data.currentUser?.email_verified === false}
		<p style="color: white; background-color: brown; padding: 0.3em;">
			Your email isn’t verified yet. Check your inbox for the verification link. <button
				onclick={() => _sendEmailVerification()}>Resend verification email.</button
			>
		</p>
	{/if}
	<hr />
{/if}

<p>
	GitHub: <a href="https://github.com/MIERUNE/sveltekit-firebase-auth-ssr" target="_blank"
		>MIERUNE/sveltekit-firebase-auth-ssr</a
	>
</p>

<ul>
	<li><a href="/">Home</a></li>
	<li><a href="/private">Private</a></li>
	<li><a href="/shop">Shop</a></li>
	{#if data.currentIdToken === undefined}
		<li><a href="/login">Login</a></li>
	{/if}
</ul>

{@render children()}
