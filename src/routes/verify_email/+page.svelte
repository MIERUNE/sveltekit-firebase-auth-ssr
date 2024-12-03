<script lang="ts">
	let { data } = $props();
</script>

{#if !data.currentIdToken?.email_verified}
	<h1>Email Verification Required</h1>
	<p>
		Your email must be verified to access certain pages. Please check your inbox for the
		verification link.
	</p>
	<pre>{JSON.stringify(data.currentIdToken, null, 2)}</pre>
{:else}
	<h1>Email Verification Succeeded!</h1>
	<p>Thank you for verifying your email.</p>
	<pre>{JSON.stringify(data.currentIdToken, null, 2)}</pre>
{/if}
