<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let statusFilter = $state('all');
	let search = $state('');
	let statusOverrides = $state<Record<string, string>>({});
	let savingId = $state<string | null>(null);

	const statusLabels: Record<string, string> = {
		new: 'New',
		processing: 'Processing',
		shipped: 'Shipped',
		delivered: 'Delivered',
		cancelled: 'Cancelled'
	};

	function displayStatus(order: (typeof data.orders)[number]) {
		return statusOverrides[order.id] ?? order.status;
	}

	const filtered = $derived(
		data.orders.filter((o) => {
			if (statusFilter !== 'all' && displayStatus(o) !== statusFilter) return false;
			if (search.trim()) {
				const q = search.trim().toLowerCase();
				const haystack = `${o.customerEmail ?? ''} ${o.customerName ?? ''} ${o.id}`.toLowerCase();
				if (!haystack.includes(q)) return false;
			}
			return true;
		})
	);

	function fmtDate(d: string | Date | null) {
		if (!d) return '—';
		return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function fmtMoney(cents: number | null) {
		return ((cents ?? 0) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	}
</script>

<svelte:head>
	<title>Orders — Admin</title>
</svelte:head>

<h1>Orders</h1>

<div class="toolbar">
	<input class="search" type="text" placeholder="Search by name, email, or order ID" bind:value={search} />
	<select bind:value={statusFilter}>
		<option value="all">All statuses</option>
		<option value="new">New</option>
		<option value="processing">Processing</option>
		<option value="shipped">Shipped</option>
		<option value="delivered">Delivered</option>
		<option value="cancelled">Cancelled</option>
	</select>
</div>

{#if filtered.length === 0}
	<p class="empty">No orders found.</p>
{:else}
	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th>Date</th>
					<th>Customer</th>
					<th>Total</th>
					<th>Status</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each filtered as order (order.id)}
					<tr>
						<td>{fmtDate(order.createdAt)}</td>
						<td>
							<div class="customer-name">{order.customerName ?? '—'}</div>
							<div class="customer-email">{order.customerEmail ?? '—'}</div>
						</td>
						<td>{fmtMoney(order.amountTotal)}</td>
						<td>
							<form
								method="post"
								action="?/updateStatus"
								use:enhance={({ formData }) => {
									const id = formData.get('id')?.toString() ?? '';
									const newStatus = formData.get('status')?.toString() ?? '';
									const previous = statusOverrides[id] ?? order.status;
									statusOverrides = { ...statusOverrides, [id]: newStatus };
									savingId = id;
									return async ({ result }) => {
										savingId = null;
										if (result.type === 'failure' || result.type === 'error') {
											statusOverrides = { ...statusOverrides, [id]: previous };
										}
									};
								}}
							>
								<input type="hidden" name="id" value={order.id} />
								<select
									name="status"
									class="status-select status-{displayStatus(order)}"
									value={displayStatus(order)}
									disabled={savingId === order.id}
									onchange={(e) => e.currentTarget.form?.requestSubmit()}
								>
									<option value="new">New</option>
									<option value="processing">Processing</option>
									<option value="shipped">Shipped</option>
									<option value="delivered">Delivered</option>
									<option value="cancelled">Cancelled</option>
								</select>
							</form>
						</td>
						<td><a href="/admin/orders/{order.id}" class="view-link">View →</a></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	h1 {
		font-size: 1.6rem;
		margin-bottom: 24px;
	}
	.toolbar {
		display: flex;
		gap: 12px;
		margin-bottom: 20px;
	}
	.search {
		flex: 1;
		padding: 10px 14px;
		border: 1px solid #d8d2c8;
		border-radius: 6px;
		font-size: 0.9rem;
	}
	select {
		padding: 10px 14px;
		border: 1px solid #d8d2c8;
		border-radius: 6px;
		font-size: 0.9rem;
		background: #fff;
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
		vertical-align: top;
	}
	tr:last-child td {
		border-bottom: none;
	}
	.customer-name {
		font-weight: 600;
		color: #3d342c;
	}
	.customer-email {
		font-size: 0.8rem;
		color: #7a7168;
	}
	.status-select {
		display: inline-block;
		padding: 5px 10px;
		border-radius: 20px;
		font-size: 0.78rem;
		font-weight: 600;
		border: none;
		cursor: pointer;
	}
	.status-select:disabled {
		opacity: 0.6;
		cursor: wait;
	}
	.status-select:focus {
		outline: 2px solid var(--color-bark, #5c3d1e);
		outline-offset: 1px;
	}
	.status-new {
		background: #e8eef7;
		color: #2b5797;
	}
	.status-processing {
		background: #fdf1dc;
		color: #966400;
	}
	.status-shipped {
		background: #e6e0f5;
		color: #5b3fa0;
	}
	.status-delivered {
		background: #e2f3e5;
		color: #2d7a2d;
	}
	.status-cancelled {
		background: #fbe3e1;
		color: #b3261e;
	}
	.view-link {
		color: #5c3d1e;
		font-weight: 600;
		font-size: 0.85rem;
		text-decoration: none;
		white-space: nowrap;
	}
	.view-link:hover {
		text-decoration: underline;
	}
</style>
