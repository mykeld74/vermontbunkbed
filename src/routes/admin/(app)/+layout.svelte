<script lang="ts">
	import { page } from '$app/state';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const navItems = $derived([
		{ href: '/admin', label: 'Orders' },
		...(data.isAdmin ? [{ href: '/admin/users', label: 'Users' }] : []),
		{ href: '/admin/account', label: 'Account' }
	]);
</script>

<div class="admin-shell">
	<header class="admin-header">
		<div class="admin-header-left">
			<a href="/admin" class="admin-logo">Vermont Bunk Beds — Admin</a>
			<nav class="admin-nav" aria-label="Admin">
				{#each navItems as item}
					<a href={item.href} class:active={page.url.pathname === item.href}>{item.label}</a>
				{/each}
			</nav>
		</div>
		<div class="admin-header-right">
			<span class="admin-user">{data.user.email}</span>
			<span class="admin-role">{data.role === 'admin' ? 'Admin' : 'User'}</span>
			<form method="post" action="/admin/logout">
				<button class="admin-signout">Sign Out</button>
			</form>
		</div>
	</header>
	<main class="admin-main">
		{@render children()}
	</main>
</div>

<style>
	.admin-shell {
		min-height: 100vh;
		background: #f5f3ef;
	}
	.admin-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 16px 32px;
		background: #2c2420;
		color: #fff;
	}
	.admin-header-left {
		display: flex;
		align-items: center;
		gap: 28px;
		min-width: 0;
	}
	.admin-logo {
		color: #fff;
		font-weight: 700;
		text-decoration: none;
		font-size: 1.05rem;
		white-space: nowrap;
	}
	.admin-nav {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.admin-nav a {
		color: rgba(255, 255, 255, 0.72);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 600;
		padding: 6px 12px;
		border-radius: 6px;
	}
	.admin-nav a:hover,
	.admin-nav a.active {
		color: #fff;
		background: rgba(255, 255, 255, 0.1);
	}
	.admin-header-right {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-shrink: 0;
	}
	.admin-user {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.75);
	}
	.admin-role {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #2c2420;
		background: #e8dfd2;
		padding: 4px 8px;
		border-radius: 999px;
	}
	.admin-signout {
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.4);
		color: #fff;
		padding: 6px 14px;
		border-radius: 6px;
		font-size: 0.85rem;
		cursor: pointer;
	}
	.admin-signout:hover {
		background: rgba(255, 255, 255, 0.1);
	}
	.admin-main {
		max-width: 1100px;
		margin: 0 auto;
		padding: 32px;
	}
	@media (max-width: 720px) {
		.admin-header {
			flex-direction: column;
			align-items: flex-start;
		}
		.admin-header-left {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}
	}
</style>
