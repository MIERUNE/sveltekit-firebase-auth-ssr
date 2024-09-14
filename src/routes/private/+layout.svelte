<script lang="ts">
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	let {
		data,
		children
	}: {
		data: PageData;
		children: Snippet;
	} = $props();

	if (browser && !data.currentUser) {
		goto('/login?next=' + encodeURIComponent($page.url.pathname), { replaceState: true });
	}
</script>

{@render children()}
