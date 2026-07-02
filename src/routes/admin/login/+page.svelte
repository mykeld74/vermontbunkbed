<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Admin Login — Vermont Bunk Beds</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<h1>Admin Login</h1>
		<p class="auth-sub">Vermont Bunk Beds order dashboard</p>

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
					autocomplete="current-password"
				/>
			</label>
			<p class="auth-forgot">
				<a href="/admin/forgot-password">Forgot your password?</a>
			</p>
			{#if data.passwordReset}
				<p class="admin-message admin-message--success">
					Your password has been updated. Sign in with your new password.
				</p>
			{/if}
			{#if form?.message}
				<p class="admin-message admin-message--error">{form.message}</p>
			{/if}
			<button class="admin-btn admin-btn--block" type="submit" disabled={loading}>
				{loading ? 'Signing in…' : 'Sign In'}
			</button>
		</form>

		<p class="auth-note">
			Need an account? <a href="/admin/signup">Create one</a>
		</p>
	</div>
</div>
