<script lang="ts">
	import { login } from '$lib/firebase/client.js';

	let { data } = $props();
</script>

<h1>Login</h1>

<button onclick={login} disabled={data.currentUser !== undefined}>Sign-in with Google</button>
