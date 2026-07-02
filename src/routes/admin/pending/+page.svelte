<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Access Pending — Vermont Bunk Beds</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<h1>Access Pending</h1>
		<p class="auth-sub">
			Your account (<strong>{data.user.email}</strong>) has been created, but an administrator has
			not assigned you a role yet.
		</p>
		<p class="auth-sub">
			Please contact an administrator to request access. You can sign out and check back after your
			role has been assigned.
		</p>
		<form method="post" action="/admin/logout">
			<button class="admin-btn admin-btn--block" type="submit">Sign Out</button>
		</form>
		<p class="auth-note"><a href="/admin/login">Back to sign in</a></p>
	</div>
</div>
