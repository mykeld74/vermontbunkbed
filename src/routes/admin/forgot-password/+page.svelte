<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Forgot Password — Vermont Bunk Beds</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-card">
		<h1>Forgot Password</h1>
		{#if form?.success}
			<p class="admin-message admin-message--success admin-message--block">
				If an account exists for <strong>{form.email}</strong>, we sent a password reset link. Check
				your inbox.
			</p>
			<p class="auth-note"><a href="/admin/login">Back to sign in</a></p>
		{:else}
			<p class="auth-sub">Enter your email and we will send you a reset link.</p>

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
				{#if form?.message}
					<p class="admin-message admin-message--error">{form.message}</p>
				{/if}
				<button class="admin-btn admin-btn--block" type="submit" disabled={loading}>
					{loading ? 'Sending…' : 'Send Reset Link'}
				</button>
			</form>

			<p class="auth-note"><a href="/admin/login">Back to sign in</a></p>
		{/if}
	</div>
</div>
