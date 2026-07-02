<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Admin Login — Vermont Bunk Beds</title>
</svelte:head>

<div class="login-page">
	<div class="login-card">
		<h1>Admin Login</h1>
		<p class="sub">Vermont Bunk Beds order dashboard</p>

		<form
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
				<input type="email" name="email" required autocomplete="email" />
			</label>
			<label>
				Password
				<input type="password" name="password" required autocomplete="current-password" />
			</label>
			<p class="forgot-password">
				<a href="/admin/forgot-password">Forgot your password?</a>
			</p>
			{#if data.passwordReset}
				<p class="success">Your password has been updated. Sign in with your new password.</p>
			{/if}
			{#if form?.message}
				<p class="error">{form.message}</p>
			{/if}
			<button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
		</form>

		<p class="signup-note">
			{#if data.allowSignup}
				Setting up for the first time? <a href="/admin/signup">Create the first admin account</a>
			{/if}
		</p>
	</div>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f5f3ef;
		padding: 24px;
	}
	.login-card {
		background: #fff;
		border-radius: 12px;
		padding: 40px;
		width: 100%;
		max-width: 380px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
	}
	h1 {
		font-size: 1.4rem;
		margin-bottom: 4px;
	}
	.sub {
		color: #7a7168;
		font-size: 0.9rem;
		margin-bottom: 28px;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.85rem;
		font-weight: 600;
		color: #3d342c;
	}
	input {
		padding: 10px 12px;
		border: 1px solid #d8d2c8;
		border-radius: 6px;
		font-size: 0.95rem;
		font-weight: 400;
	}
	input:focus {
		outline: none;
		border-color: #5c3d1e;
	}
	button[type='submit'] {
		margin-top: 8px;
		background: #5c3d1e;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 11px;
		font-weight: 600;
		cursor: pointer;
	}
	button[type='submit']:hover {
		background: #7a5230;
	}
	button[type='submit']:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.error {
		color: #b3261e;
		font-size: 0.85rem;
		margin: 0;
	}
	.success {
		color: #2d7a2d;
		font-size: 0.85rem;
		margin: 0;
	}
	.forgot-password {
		margin: -4px 0 0;
		text-align: right;
	}
	.forgot-password a {
		color: #5c3d1e;
		font-size: 0.82rem;
		font-weight: 600;
		text-decoration: none;
	}
	.forgot-password a:hover {
		text-decoration: underline;
	}
	.signup-note {
		margin-top: 20px;
		font-size: 0.85rem;
		text-align: center;
		color: #7a7168;
	}
	.signup-note a {
		color: #5c3d1e;
		font-weight: 600;
	}
</style>
