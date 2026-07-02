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

<h1 class="admin-page-title admin-page-title--tight">Account</h1>
<p class="admin-intro">Signed in as <strong>{data.user.email}</strong></p>

<section class="admin-card admin-card--narrow">
	<h2 class="admin-card-title">Change Password</h2>

	{#if form?.success}
		<p class="admin-banner admin-banner--success">Your password has been updated.</p>
	{/if}

	<form
		class="admin-form"
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
				class="admin-field"
				type="password"
				name="currentPassword"
				required
				autocomplete="current-password"
			/>
		</label>
		<label>
			New Password
			<input
				class="admin-field"
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
				class="admin-field"
				type="password"
				name="confirmPassword"
				required
				minlength="8"
				autocomplete="new-password"
			/>
		</label>

		{#if form?.message}
			<p class="admin-banner admin-banner--error">{form.message}</p>
		{/if}

		<button type="submit" class="admin-btn admin-btn--align-start" disabled={saving}>
			{saving ? 'Updating…' : 'Update Password'}
		</button>
	</form>
</section>
