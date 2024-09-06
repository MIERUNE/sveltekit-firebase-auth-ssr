<script lang="ts">
	let disabled = $state<boolean>(false);
	let checked = $state<boolean>(false);
</script>

<h1>Home</h1>

<button
	onclick={() => {
		disabled = !disabled;
	}}>{disabled ? 'Enable' : 'Disable'}</button
>

<label>
	<input type="checkbox" bind:checked {disabled} />: {checked ? 'checked' : 'unchecked'}
</label>
