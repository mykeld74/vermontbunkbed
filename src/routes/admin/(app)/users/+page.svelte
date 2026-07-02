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
</script>

<svelte:head>
	<title>Users — Admin</title>
</svelte:head>

<div class="page-header">
	<h1>Users</h1>
	<button type="button" class="primary-btn" onclick={() => (showCreateForm = !showCreateForm)}>
		{showCreateForm ? 'Cancel' : 'Add User'}
	</button>
</div>

{#if showCreateForm}
	<section class="card create-card">
		<h2>Add User</h2>
		<form
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
			<div class="form-grid">
				<label>
					Name
					<input name="name" required autocomplete="name" />
				</label>
				<label>
					Email
					<input type="email" name="email" required autocomplete="email" />
				</label>
				<label>
					Password
					<input type="password" name="password" required minlength="8" autocomplete="new-password" />
				</label>
				<label>
					Role
					<select name="role">
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</label>
			</div>
			<button type="submit" class="primary-btn" disabled={creating}>
				{creating ? 'Creating…' : 'Create User'}
			</button>
		</form>
	</section>
{/if}

{#if form?.message}
	<p class="banner error">{form.message}</p>
{/if}

{#if data.users.length === 0}
	<p class="empty">No users found.</p>
{:else}
	<div class="table-wrap">
		<table>
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
									class="role-select role-{dashboardUser.role?.split(',')[0]?.trim() ?? 'user'}"
									value={dashboardUser.role?.split(',')[0]?.trim() ?? 'user'}
									disabled={savingUserId === dashboardUser.id}
									onchange={(e) => e.currentTarget.form?.requestSubmit()}
								>
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
										class="danger-btn"
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
	Admins can manage orders and users. Users can manage orders only.
</p>

<style>
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 24px;
	}
	h1 {
		font-size: 1.6rem;
		margin: 0;
	}
	h2 {
		font-size: 1.1rem;
		margin: 0 0 16px;
	}
	.card {
		background: #fff;
		border-radius: 10px;
		padding: 24px;
		margin-bottom: 24px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
	}
	.form-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
		margin-bottom: 16px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.85rem;
		font-weight: 600;
		color: #3d342c;
	}
	input,
	select {
		padding: 10px 12px;
		border: 1px solid #d8d2c8;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 400;
		background: #fff;
	}
	.primary-btn {
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
	.danger-btn {
		background: transparent;
		color: #b3261e;
		border: 1px solid #e8b4b0;
		border-radius: 6px;
		padding: 6px 12px;
		font-size: 0.82rem;
		font-weight: 600;
		cursor: pointer;
	}
	.danger-btn:hover {
		background: #fdf1f0;
	}
	.danger-btn:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	.banner {
		padding: 12px 16px;
		border-radius: 8px;
		margin-bottom: 16px;
		font-size: 0.9rem;
	}
	.banner.error {
		background: #fdf1f0;
		color: #b3261e;
	}
	.empty {
		color: #7a7168;
		padding: 32px 0;
	}
	.table-wrap {
		background: #fff;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
	}
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th {
		text-align: left;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #7a7168;
		padding: 14px 20px;
		border-bottom: 1px solid #eee;
	}
	td {
		padding: 14px 20px;
		border-bottom: 1px solid #f0ede8;
		font-size: 0.9rem;
		vertical-align: middle;
	}
	tr:last-child td {
		border-bottom: none;
	}
	.user-name {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		color: #3d342c;
	}
	.you-badge {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #5c3d1e;
		background: #f3ebe3;
		padding: 2px 8px;
		border-radius: 999px;
	}
	.role-select {
		padding: 5px 10px;
		border-radius: 20px;
		font-size: 0.78rem;
		font-weight: 600;
		border: none;
		cursor: pointer;
	}
	.role-select:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	.role-admin {
		background: #e8eef7;
		color: #2b5797;
	}
	.role-user {
		background: #f0ede8;
		color: #5c534a;
	}
	.help-text {
		margin-top: 16px;
		color: #7a7168;
		font-size: 0.85rem;
	}
	@media (max-width: 720px) {
		.form-grid {
			grid-template-columns: 1fr;
		}
		.page-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
