<script lang="ts">
	import { EmbeddedCheckout } from 'svelte-stripe';
	import stripe from '$lib/stripe/stripe.svelte';

	let { data } = $props();
</script>

<p><a href="/shop/">Shop</a> / Subscription</p>

<h2>Subscription</h2>

<p>Customer Id: {data.customerId}</p>

<p>ダミーカード番号として: 4242 4242 4242 4242 (Visa) などが使えます</p>

{#if stripe.stripe}
	<EmbeddedCheckout stripe={stripe.stripe} clientSecret={data.clientSecret} />
{/if}
