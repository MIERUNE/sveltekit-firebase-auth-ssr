<script lang="ts">
	import { FirebaseError } from 'firebase/app';
	import {
		getAuth,
		sendEmailVerification,
		sendPasswordResetEmail,
		sendSignInLinkToEmail,
		signInWithEmailLink,
		isSignInWithEmailLink
	} from 'firebase/auth';
	import {
		signInWithGoogle,
		waitForRedirectResult,
		signInWithEmailAndPassword,
		createUserWithEmailAndPassword
	} from '$lib/firebase-auth/client';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	const redirectResult = waitForRedirectResult();

	let { data } = $props();

	let email = $state('');
	let password = $state('');
	let errorCode = $state('');

	if (browser) {
		const auth = getAuth();
		if (isSignInWithEmailLink(auth, window.location.href)) {
			let email = window.localStorage.getItem('emailForSignIn');
			if (!email) {
				email = window.prompt('Please provide your email for confirmation');
			}
			if (email) {
				signInWithEmailLink(auth, email, window.location.href).then((result) => {
					window.localStorage.removeItem('emailForSignIn');
				});
			}
		}
	}

	async function signInWithPassword() {
		try {
			await signInWithEmailAndPassword(email, password);
		} catch (error) {
			if (error instanceof FirebaseError) {
				errorCode = error.code;
			}
		}
	}

	async function sendMagicLink() {
		try {
			const auth = getAuth();
			await sendSignInLinkToEmail(auth, email, {
				url: $page.url.origin + '/login?email-link',
				handleCodeInApp: true,
				dynamicLinkDomain: $page.url.hostname
			});
			window.localStorage.setItem('emailForSignIn', email);
			alert("We've sent you an email with a link to sign in!");
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
			try {
				await sendPasswordResetEmail(auth, email, { url: $page.url.origin + '/login' });
			} catch (error) {
				if (error instanceof FirebaseError) {
					errorCode = error.code;
					return;
				}
			}
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
			<p>You need to log in to view this page.</p>
		{/if}

		Single Sign-On:
		<button onclick={signInWithGoogle} disabled={data.currentIdToken !== undefined}
			>Sign-in with Google</button
		>
		<hr />
		<div>
			<p>Or sign-in with email and password:</p>
			{#if errorCode}
				<p style="color: red;">{errorCode}</p>
			{/if}
			<p>
				<label
					>Email: <input
						type="email"
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
				<button onclick={signInWithPassword} disabled={!email || !password}>Sign-In</button>
				<button onclick={signUpWithPassword} disabled={!email || !password}>Sign-Up</button>
				<button onclick={resetPassword} disabled={!email}>Reset Password</button>
				<button onclick={sendMagicLink} disabled={!email}>Send Magic Link</button>
			</p>
		</div>
	{/if}
{/await}
