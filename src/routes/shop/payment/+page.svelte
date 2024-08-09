<script lang="ts">
	import { EmbeddedCheckout } from 'svelte-stripe';
	import stripe from '$lib/stripe/stripe.svelte.js';

	let { data } = $props();
</script>

<p><a href="/shop/">Shop</a> / Payment</p>

<h2>Single Payment</h2>

<p>Customer Id: {data.customerId}</p>

<p>ダミーカード番号として: 4242 4242 4242 4242 (Visa) などが使えます</p>

{#if stripe.stripe}
	<EmbeddedCheckout stripe={stripe.stripe} clientSecret={data.clientSecret} />
{/if}
