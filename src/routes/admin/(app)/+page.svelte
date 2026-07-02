<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let statusFilter = $state('all');
	let search = $state('');
	let statusOverrides = $state<Record<string, string>>({});
	let savingId = $state<string | null>(null);

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
		return new Date(d).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function fmtMoney(cents: number | null) {
		return ((cents ?? 0) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	}
</script>

<svelte:head>
	<title>Orders — Admin</title>
</svelte:head>

<h1 class="admin-page-title">Orders</h1>

<div class="admin-toolbar">
	<input
		class="admin-search"
		type="text"
		placeholder="Search by name, email, or order ID"
		bind:value={search}
	/>
	<select class="admin-field" bind:value={statusFilter}>
		<option value="all">All statuses</option>
		<option value="new">New</option>
		<option value="processing">Processing</option>
		<option value="shipped">Shipped</option>
		<option value="delivered">Delivered</option>
		<option value="cancelled">Cancelled</option>
	</select>
</div>

{#if filtered.length === 0}
	<p class="admin-empty">No orders found.</p>
{:else}
	<div class="admin-table-wrap">
		<table class="admin-table admin-table--top">
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
						<td>
							<a href="/admin/orders/{order.id}" class="admin-link admin-link--sm">View →</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
