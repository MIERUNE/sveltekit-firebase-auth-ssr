<script lang="ts">
	import { FirebaseError } from 'firebase/app';
	import { getAuth, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
	import {
		signInWithGoogle,
		waitForRedirectResult,
		signInWithEmailAndPassword,
		createUserWithEmailAndPassword
	} from '$lib/firebase-auth/client';
	import { page } from '$app/stores';

	const redirectResult = waitForRedirectResult();

	let { data } = $props();

	let email = $state('');
	let password = $state('');
	let errorCode = $state('');

	async function signInWithPassword() {
		try {
			await signInWithEmailAndPassword(email, password);
		} catch (error) {
			if (error instanceof FirebaseError) {
				errorCode = error.code;
			}
		}
	}

	async function signUpWithPassword() {
		try {
			const cred = await createUserWithEmailAndPassword(email, password);
			await sendEmailVerification(cred.user, { url: $page.url.origin + '/verify_email' });
		} catch (error) {
			if (error instanceof FirebaseError) {
				errorCode = error.code;
			}
		}
	}

	async function resetPassword() {
		if (email !== '') {
			const auth = getAuth();
			await sendPasswordResetEmail(auth, email, {
				url: $page.url.origin + '/login'
			});
			alert('Password reset email sent.');
		}
		email = '';
	}
</script>

<h1>Login</h1>

{#await redirectResult}
	loading...
{:then result}
	{#if !result}
		{#if $page.url.searchParams.get('next')}
			<p>You need to log in.</p>
		{/if}

		<button onclick={signInWithGoogle} disabled={data.currentIdToken !== undefined}
			>Sign-in with Google</button
		>
		<!--
		<button onclick={signInWithTwitter} disabled={data.currentIdToken !== undefined}
			>Sign-in with Twitter</button
		>
		-->
		<hr />
		<div>
			{#if errorCode}
				<p style="color: red;">{errorCode}</p>
			{/if}
			<p>
				<label
					>Email: <input
						type="text"
						size="30"
						bind:value={email}
						placeholder="name@example.com"
					/></label
				>
				<label
					>Password: <input
						type="password"
						size="30"
						bind:value={password}
						placeholder="your password"
					/></label
				>
			</p>
			<p>
				<button onclick={signInWithPassword}>Sign-In</button>
				<button onclick={signUpWithPassword}>Sign-Up</button>
				<button onclick={resetPassword}>Reset Password</button>
			</p>
		</div>
	{/if}
{/await}
