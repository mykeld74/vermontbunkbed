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
