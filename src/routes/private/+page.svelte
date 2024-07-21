<script lang="ts">
	const { data } = $props();
</script>

<h1>Private Area</h1>

<p>This is a private page.</p>

<ul>
	{#each data.posts as post}
		<li>{post.title}</li>
	{/each}
</ul>
