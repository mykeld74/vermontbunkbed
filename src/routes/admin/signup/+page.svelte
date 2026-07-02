<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Create Account — Vermont Bunk Beds</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<h1>Create Account</h1>
		{#if data.isBootstrap}
			<p class="auth-sub">
				Set up the first administrator account. The first account is granted admin access
				automatically.
			</p>
		{:else}
			<p class="auth-sub">
				Create your account. An administrator will assign your role before you can access the
				dashboard.
			</p>
		{/if}

		<form
			class="admin-form"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<label>
				Name
				<input class="admin-field" name="name" required autocomplete="name" />
			</label>
			<label>
				Email
				<input class="admin-field" type="email" name="email" required autocomplete="email" />
			</label>
			<label>
				Password
				<input
					class="admin-field"
					type="password"
					name="password"
					required
					minlength="8"
					autocomplete="new-password"
				/>
			</label>
			{#if form?.message}
				<p class="admin-message admin-message--error">{form.message}</p>
			{/if}
			<button class="admin-btn admin-btn--block" type="submit" disabled={loading}>
				{loading ? 'Creating account…' : 'Create Account'}
			</button>
		</form>

		<p class="auth-note">Already have an account? <a href="/admin/login">Sign in</a></p>
	</div>
</div>
