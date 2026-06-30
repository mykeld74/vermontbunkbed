<script lang="ts">
	import '$lib/styles/global.css';
	import { cart } from '$lib/cart.svelte';
	import { page } from '$app/stores';
	import logoImg from '$lib/assets/logo.webp';

	let { children } = $props();

	let mobileMenuOpen = $state(false);
	let scrollY = $state(0);

	const LOGO_START = 140;
	const LOGO_MIN = 110;
	const NAV_START = 162; // LOGO_START + 16px padding (8px top/bottom)
	const NAV_MIN = 80;
	const SCROLL_RANGE = 120; // px of scroll over which shrinking happens

	// Clamp progress 0→1 over SCROLL_RANGE
	const progress = $derived(Math.min(scrollY / SCROLL_RANGE, 1));
	const logoSize = $derived(LOGO_START - (LOGO_START - LOGO_MIN) * progress);
	const navHeight = $derived(NAV_START - (NAV_START - NAV_MIN) * progress);
</script>

<svelte:window bind:scrollY />

<div class="site-wrapper">
	<header class="site-header" style="height: {navHeight}px;">
		<div class="container header-inner">
			<a href="/" class="logo" onclick={() => (mobileMenuOpen = false)}>
				<img src={logoImg} alt="Vermont Bunk Beds" class="logo-img" style="height: {logoSize}px;" />
			</a>

			<nav class="main-nav" class:open={mobileMenuOpen}>
				<a
					href="/collections"
					class:active={$page.url.pathname.startsWith('/collections')}
					onclick={() => (mobileMenuOpen = false)}>Collections</a
				>
				<a
					href="/about"
					class:active={$page.url.pathname === '/about'}
					onclick={() => (mobileMenuOpen = false)}>Our Story</a
				>
				<a
					href="/finishes"
					class:active={$page.url.pathname.startsWith('/finishes')}
					onclick={() => (mobileMenuOpen = false)}>Finishes</a
				>
				<a
					href="/contact"
					class:active={$page.url.pathname.startsWith('/contact')}
					onclick={() => (mobileMenuOpen = false)}>Contact</a
				>
			</nav>

			<div class="header-actions">
				<a href="/cart" class="cart-btn" aria-label="Cart">
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
						<line x1="3" y1="6" x2="21" y2="6" />
						<path d="M16 10a4 4 0 01-8 0" />
					</svg>
					{#if cart.count > 0}
						<span class="cart-count">{cart.count}</span>
					{/if}
				</a>

				<button
					class="mobile-menu-btn"
					aria-label="Toggle menu"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				>
					{#if mobileMenuOpen}
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					{:else}
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line
								x1="3"
								y1="18"
								x2="21"
								y2="18"
							/>
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</header>

	<main class="site-main">
		{@render children()}
	</main>

	<footer class="site-footer">
		<div class="container footer-inner">
			<div class="footer-brand">
				<a href="/" class="logo logo-light">
					<img src={logoImg} alt="Vermont Bunk Beds" class="logo-img logo-img-light" />
				</a>
				<p>
					Handcrafted solid wood bunk beds built on our small family farm in Starksboro, Vermont.
				</p>
			</div>

			<div class="footer-links">
				<div class="footer-col">
					<h4>Shop</h4>
					<a href="/collections">All Collections</a>
					<a href="/finishes">Finish Options</a>
				</div>
				<div class="footer-col">
					<h4>Company</h4>
					<a href="/about">Our Story</a>
					<a href="/contact">Contact Us</a>
				</div>
			</div>
		</div>

		<div class="footer-bottom">
			<div class="container">
				<p>&copy; {new Date().getFullYear()} Vermont Bunk Beds. All rights reserved.</p>
			</div>
		</div>
	</footer>
</div>

<style>
	.site-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	.site-main {
		flex: 1;
	}

	/* Header */
	.site-header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: var(--color-warm-white);
		overflow: visible;
	}

	.header-inner {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		height: 100%;
		gap: 32px;
		padding-top: 8px;
	}

	/* Nav links vertically centered within the shrinking header */
	.header-inner > nav,
	.header-inner > .header-actions {
		margin-top: auto;
		margin-bottom: auto;
	}

	/* Logo */
	.logo {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		text-decoration: none;
		flex-shrink: 0;
		padding: 5px;
		border-radius: 1000px;
		background: var(--color-warm-white);
	}

	.logo-img {
		width: auto;
		display: block;
		/* height driven by inline style */
	}

	.logo-img-light {
		filter: brightness(0) invert(1);
		opacity: 0.9;
	}

	/* Nav */
	.main-nav {
		display: flex;
		align-items: center;
		gap: 32px;
		flex: 1;
		justify-content: center;
	}

	.main-nav a {
		font-size: 0.9rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-body);
		padding-bottom: 2px;
		border-bottom: 2px solid transparent;
		transition:
			color 0.2s,
			border-color 0.2s;
	}

	.main-nav a:hover,
	.main-nav a.active {
		color: var(--color-bark);
		border-bottom-color: var(--color-bark);
	}

	/* Header actions */
	.header-actions {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.cart-btn {
		position: relative;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-charcoal);
		border-radius: var(--radius-sm);
		transition:
			background 0.2s,
			color 0.2s;
	}

	.cart-btn:hover {
		background: var(--color-tan-light);
		color: var(--color-bark);
	}

	.cart-count {
		position: absolute;
		top: 4px;
		right: 4px;
		width: 18px;
		height: 18px;
		background: var(--color-bark);
		color: #fff;
		border-radius: 50%;
		font-size: 0.65rem;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mobile-menu-btn {
		display: none;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		color: var(--color-charcoal);
		border-radius: var(--radius-sm);
		transition: background 0.2s;
	}

	.mobile-menu-btn:hover {
		background: var(--color-tan-light);
	}

	/* Footer */
	.site-footer {
		background: var(--color-charcoal);
		color: rgba(255, 255, 255, 0.75);
		margin-top: auto;
	}

	.footer-inner {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 64px;
		padding: 64px 24px;
	}

	.footer-brand p {
		margin-top: 16px;
		font-size: 0.9rem;
		max-width: 280px;
		line-height: 1.7;
	}

	.footer-links {
		display: flex;
		gap: 64px;
	}

	.footer-col {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.footer-col h4 {
		font-family: var(--font-heading);
		color: #fff;
		font-size: 0.85rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-bottom: 4px;
	}

	.footer-col a {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.65);
		transition: color 0.2s;
	}
	.footer-col a:hover {
		color: var(--color-tan);
	}

	.footer-bottom {
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		padding: 20px 24px;
	}

	.footer-bottom p {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.4);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.main-nav {
			display: none;
			position: absolute;
			top: 72px;
			left: 0;
			right: 0;
			background: var(--color-warm-white);
			flex-direction: column;
			gap: 0;
			border-bottom: 1px solid var(--color-tan-light);
			box-shadow: var(--shadow-md);
		}

		.main-nav.open {
			display: flex;
		}

		.main-nav a {
			width: 100%;
			padding: 16px 24px;
			border-bottom: 1px solid var(--color-tan-light);
			border-bottom-width: 1px;
		}

		.mobile-menu-btn {
			display: flex;
		}

		.footer-inner {
			grid-template-columns: 1fr;
			gap: 40px;
		}
		.footer-links {
			flex-wrap: wrap;
			gap: 40px;
		}
	}
</style>
