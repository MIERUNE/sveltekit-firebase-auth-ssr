<script lang="ts">
	import type { Snippet } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data, children } = $props<{
		children: Snippet;
	}>();

	if (browser && !data.currentUser) {
		goto('/login?next=' + encodeURIComponent($page.url.pathname), { replaceState: true });
	}
</script>

{@render children()}
