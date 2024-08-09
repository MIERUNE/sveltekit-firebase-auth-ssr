<script lang="ts">
	import { page } from '$app/stores';

	let session_id = $derived($page.params['session_id']);
</script>

<h1>成功</h1>

<p>決済は成功しました。</p>

<p>{session_id}</p>

<p><a href="/shop/">Shop に戻る</a></p>
