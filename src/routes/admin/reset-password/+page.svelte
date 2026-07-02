<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Reset Password — Vermont Bunk Beds</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<h1>Reset Password</h1>

		{#if data.invalid}
			<p class="admin-message admin-message--error admin-message--block">
				This reset link is invalid or has expired. Request a new one to continue.
			</p>
			<p class="auth-note"><a href="/admin/forgot-password">Request a new reset link</a></p>
		{:else}
			<p class="auth-sub">Choose a new password for your account.</p>

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
				<input type="hidden" name="token" value={data.token} />
				<label>
					New Password
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
					{loading ? 'Saving…' : 'Update Password'}
				</button>
			</form>
		{/if}
	</div>
</div>
