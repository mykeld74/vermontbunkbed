<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showCreateForm = $state(false);
	let creating = $state(false);
	let savingUserId = $state<string | null>(null);
	let deletingUserId = $state<string | null>(null);

	function fmtDate(d: string | Date | null | undefined) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function roleValue(role: string | null | undefined) {
		const primaryRole = role?.split(',')[0]?.trim().toLowerCase();
		if (primaryRole === 'admin' || primaryRole === 'user') return primaryRole;
		return 'pending';
	}
</script>

<svelte:head>
	<title>Users — Admin</title>
</svelte:head>

<div class="admin-page-header">
	<h1 class="admin-page-title">Users</h1>
	<button type="button" class="admin-btn" onclick={() => (showCreateForm = !showCreateForm)}>
		{showCreateForm ? 'Cancel' : 'Add User'}
	</button>
</div>

{#if showCreateForm}
	<section class="admin-card admin-card-spaced">
		<h2 class="admin-card-title">Add User</h2>
		<form
			class="admin-form"
			method="post"
			action="?/create"
			use:enhance={() => {
				creating = true;
				return async ({ result, update }) => {
					creating = false;
					if (result.type === 'success') {
						showCreateForm = false;
					}
					await update();
				};
			}}
		>
			<div class="admin-form-grid">
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
				<label>
					Role
					<select class="admin-field" name="role">
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</label>
			</div>
			<button type="submit" class="admin-btn" disabled={creating}>
				{creating ? 'Creating…' : 'Create User'}
			</button>
		</form>
	</section>
{/if}

{#if data.pendingCount > 0}
	<p class="admin-banner admin-banner--spaced">
		{data.pendingCount} {data.pendingCount === 1 ? 'account is' : 'accounts are'} waiting for a role
		assignment.
	</p>
{/if}

{#if form?.message}
	<p class="admin-banner admin-banner--error admin-banner--spaced">{form.message}</p>
{/if}

{#if data.users.length === 0}
	<p class="admin-empty">No users found.</p>
{:else}
	<div class="admin-table-wrap">
		<table class="admin-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Role</th>
					<th>Joined</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as dashboardUser (dashboardUser.id)}
					<tr>
						<td>
							<div class="user-name">
								{dashboardUser.name}
								{#if dashboardUser.id === data.currentUserId}
									<span class="you-badge">You</span>
								{/if}
							</div>
						</td>
						<td>{dashboardUser.email}</td>
						<td>
							<form
								method="post"
								action="?/setRole"
								use:enhance={({ formData }) => {
									const userId = formData.get('userId')?.toString() ?? '';
									savingUserId = userId;
									return async ({ update }) => {
										savingUserId = null;
										await update();
									};
								}}
							>
								<input type="hidden" name="userId" value={dashboardUser.id} />
								<select
									name="role"
									class="status-select status-{roleValue(dashboardUser.role)}"
									value={roleValue(dashboardUser.role)}
									disabled={savingUserId === dashboardUser.id}
									onchange={(e) => e.currentTarget.form?.requestSubmit()}
								>
									<option value="pending">Pending</option>
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</select>
							</form>
						</td>
						<td>{fmtDate(dashboardUser.createdAt)}</td>
						<td>
							{#if dashboardUser.id !== data.currentUserId}
								<form
									method="post"
									action="?/remove"
									use:enhance={({ cancel, formData }) => {
										const name = dashboardUser.name;
										if (!confirm(`Delete ${name}? This cannot be undone.`)) {
											cancel();
											return;
										}
										const userId = formData.get('userId')?.toString() ?? '';
										deletingUserId = userId;
										return async ({ update }) => {
											deletingUserId = null;
											await update();
										};
									}}
								>
									<input type="hidden" name="userId" value={dashboardUser.id} />
									<button
										type="submit"
										class="admin-btn admin-btn--danger"
										disabled={deletingUserId === dashboardUser.id}
									>
										{deletingUserId === dashboardUser.id ? 'Deleting…' : 'Delete'}
									</button>
								</form>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<p class="help-text">
	Admins can manage orders and users. Users can manage orders only. Pending accounts cannot sign in
	to the dashboard until a role is assigned.
</p>
