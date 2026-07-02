<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Reset Password — Vermont Bunk Beds</title>
</svelte:head>

<div class="login-page">
	<div class="login-card">
		<h1>Reset Password</h1>

		{#if data.invalid}
			<p class="error-block">
				This reset link is invalid or has expired. Request a new one to continue.
			</p>
			<p class="signup-note"><a href="/admin/forgot-password">Request a new reset link</a></p>
		{:else}
			<p class="sub">Choose a new password for your account.</p>

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
				<input type="hidden" name="token" value={data.token} />
				<label>
					New Password
					<input
						type="password"
						name="password"
						required
						minlength="8"
						autocomplete="new-password"
					/>
				</label>
				{#if form?.message}
					<p class="error">{form.message}</p>
				{/if}
				<button type="submit" disabled={loading}>
					{loading ? 'Saving…' : 'Update Password'}
				</button>
			</form>
		{/if}
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
	.error-block {
		color: #b3261e;
		font-size: 0.9rem;
		line-height: 1.5;
		margin: 0 0 20px;
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
