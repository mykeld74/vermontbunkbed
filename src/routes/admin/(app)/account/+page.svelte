<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let saving = $state(false);
	let formEl = $state<HTMLFormElement | null>(null);
</script>

<svelte:head>
	<title>Account — Admin</title>
</svelte:head>

<h1>Account</h1>
<p class="intro">Signed in as <strong>{data.user.email}</strong></p>

<section class="card">
	<h2>Change Password</h2>

	{#if form?.success}
		<p class="banner success">Your password has been updated.</p>
	{/if}

	<form
		method="post"
		action="?/changePassword"
		use:enhance={() => {
			saving = true;
			return async ({ result, update }) => {
				saving = false;
				if (result.type === 'success') {
					formEl?.reset();
				}
				await update();
			};
		}}
		id="change-password-form"
		bind:this={formEl}
	>
		<label>
			Current Password
			<input
				type="password"
				name="currentPassword"
				required
				autocomplete="current-password"
			/>
		</label>
		<label>
			New Password
			<input
				type="password"
				name="newPassword"
				required
				minlength="8"
				autocomplete="new-password"
			/>
		</label>
		<label>
			Confirm New Password
			<input
				type="password"
				name="confirmPassword"
				required
				minlength="8"
				autocomplete="new-password"
			/>
		</label>

		{#if form?.message}
			<p class="banner error">{form.message}</p>
		{/if}

		<button type="submit" class="primary-btn" disabled={saving}>
			{saving ? 'Updating…' : 'Update Password'}
		</button>
	</form>
</section>

<style>
	h1 {
		font-size: 1.6rem;
		margin-bottom: 8px;
	}
	h2 {
		font-size: 1.1rem;
		margin: 0 0 20px;
	}
	.intro {
		color: #7a7168;
		margin: 0 0 24px;
	}
	.card {
		background: #fff;
		border-radius: 10px;
		padding: 24px;
		max-width: 420px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
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
		font-size: 0.9rem;
		font-weight: 400;
	}
	input:focus {
		outline: none;
		border-color: #5c3d1e;
	}
	.primary-btn {
		align-self: flex-start;
		background: #5c3d1e;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 10px 16px;
		font-weight: 600;
		cursor: pointer;
	}
	.primary-btn:hover {
		background: #7a5230;
	}
	.primary-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.banner {
		padding: 12px 14px;
		border-radius: 8px;
		font-size: 0.9rem;
		margin: 0;
	}
	.banner.success {
		background: #e2f3e5;
		color: #2d7a2d;
	}
	.banner.error {
		background: #fdf1f0;
		color: #b3261e;
	}
</style>
