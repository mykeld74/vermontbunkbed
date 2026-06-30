<script lang="ts">
	import scottAmyImg from '$lib/assets/aboutus/acottamy.png';
	import farmHorsesImg from '$lib/assets/aboutus/farmhorses.jpg';
	import familyImg from '$lib/assets/aboutus/family.jpg';

	import sugarhouseImg from '$lib/assets/aboutus/sugarhouse.jpg';
</script>

<svelte:head>
	<title>Our Story — Vermont Bunk Beds</title>
	<meta name="description" content="Family-owned and operated since 2006, we handcraft solid wood bunk beds on our small farm in Starksboro, Vermont." />
</svelte:head>

<!-- Hero -->
<div class="page-header">
	<div class="container">
		<p class="eyebrow">Family Owned Since 2006</p>
		<h1>Our Story</h1>
		<p class="subhead">Environmentally friendly, sustainable, local, made in Vermont — these are the values and traditions of Vermont Bunk Beds.</p>
	</div>
</div>

<!-- Section 1: photo left, text right -->
<section class="section alt-row">
	<div class="container alt-grid">
		<div class="alt-img">
			<img src={scottAmyImg} alt="Scott and Amy Mansfield" />
		</div>
		<div class="alt-text">
			<h2>We Value Hard Work</h2>
			<div class="divider" aria-hidden="true"></div>
			<p>
				At Vermont Bunk Beds, owners Scott and Amy Mansfield understand the value of hard work, the
				value of a quality product, and the value of a dollar. But most of all, they simply enjoy
				the value and blessing of family.
			</p>
		</div>
	</div>
</section>

<!-- Section 2: text left, photo right -->
<section class="section alt-row">
	<div class="container alt-grid">
		<div class="alt-text">
			<h2>A Vermont Tradition</h2>
			<div class="divider" aria-hidden="true"></div>
			<p>
				In fact, as a local family farm Scott and Amy enjoy all kinds of Vermont traditions —
				everything from dairy farming and maple sugaring to horses, haying, and swimming in the
				family pond.
			</p>
			<p>
				Sleigh rides and Christmas trees fill the holiday season and fresh corn in the early fall is
				a special treat. They enjoy heating with wood so the whole family can help split and stack,
				working together to provide and enjoy a warm home.
			</p>
		</div>
		<div class="alt-img">
			<img src={sugarhouseImg} alt="The sugarhouse on the Mansfield farm" />
		</div>
	</div>
</section>

<!-- Section 3: photo left, text right -->
<section class="section alt-row">
	<div class="container alt-grid">
		<div class="alt-img">
			<img src={farmHorsesImg} alt="Draft horses on the Mansfield farm" />
		</div>
		<div class="alt-text">
			<h2>A Family Affair</h2>
			<div class="divider" aria-hidden="true"></div>
			<p>
				In shopping for bunk beds for their own children, Scott and Amy realized the need for a
				safer product that would hold up to the every day demands of their active children and yet
				still be affordable for the everyday family.
			</p>
			<p>
				So Scott and Amy began dreaming of devoting their skills and experience to building solid
				wood beds that would be safe for children and affordable for parents.
			</p>
		</div>
	</div>
</section>

<!-- Section 4: text left, photo right -->
<section class="section alt-row">
	<div class="container alt-grid">
		<div class="alt-text">
			<h2>A Note From The Owners</h2>
			<div class="divider" aria-hidden="true"></div>
			<p>
				When it comes to creating furniture, Vermont Bunk Beds believes in promoting these ideas:
				high quality, hand craftsmanship, life long durability, premier safety, long-term
				sustainability, and environmental friendliness.
			</p>
			<p>
				Our shop is located in the heart of the Champlain Valley in Starksboro, Vermont and your
				Vermont Bunk Bed will be handcrafted with love and care using the greenest materials and
				practices available today. Nothing gives us more satisfaction than creating a beautiful
				piece of furniture for your family that is safe and made to last a lifetime.
			</p>
			<p class="signature">— Scott &amp; Amy</p>
		</div>
		<div class="alt-img">
			<img src={familyImg} alt="The Mansfield family" />
		</div>
	</div>
</section>

<!-- Contact CTA -->
<section class="section contact-section">
	<div class="container contact-inner">
		<div class="contact-text">
			<h2>Get in Touch</h2>
			<p>
				We build every bed to order and love talking with families about what they're looking for.
				Reach out any time.
			</p>
		</div>
		<div class="contact-links">
			<a href="tel:8024480559" class="contact-item">
				<span class="contact-icon" aria-hidden="true">📞</span>
				<span class="contact-label">Call Us</span>
				<span class="contact-value">(802) 448-0559</span>
			</a>
			<a href="mailto:vermontbunkbeds@gmail.com" class="contact-item">
				<span class="contact-icon" aria-hidden="true">✉️</span>
				<span class="contact-label">Email Us</span>
				<span class="contact-value">vermontbunkbeds@gmail.com</span>
			</a>
			<a href="/collections" class="contact-item contact-item-cta">
				<span class="contact-icon" aria-hidden="true">🛏️</span>
				<span class="contact-label">Ready to order?</span>
				<span class="contact-value">Shop Collections →</span>
			</a>
		</div>
	</div>
</section>

<style>
	/* Hero */
	.page-header {
		background: var(--color-charcoal);
		color: #fff;
		padding: 72px 0 56px;
		text-align: center;
	}
	.eyebrow {
		font-size: 0.8rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-tan);
		font-weight: 600;
		margin-bottom: 12px;
	}
	.page-header h1 { color: #fff; margin-bottom: 16px; }
	.subhead {
		color: rgba(255, 255, 255, 0.65);
		font-size: 1.1rem;
		max-width: 480px;
		margin: 0 auto;
	}

	/* Sections */
	.section {
		padding: var(--spacing-section) 0;
	}

	/* Alternating two-col rows */
	.alt-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: center;
	}

	.alt-img img {
		width: 100%;
		display: block;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
	}

	h2 {
		margin-bottom: 8px;
	}

	.divider {
		width: 48px;
		height: 3px;
		background: var(--color-tan);
		border-radius: 2px;
		margin: 16px 0 24px;
	}

	.alt-text p {
		color: var(--color-muted);
		line-height: 1.8;
		margin-bottom: 16px;
		font-size: 1.05rem;
	}

	.signature {
		font-family: var(--font-heading);
		font-size: 1.3rem !important;
		color: var(--color-bark) !important;
		margin-top: 8px;
	}

	/* Contact */
	.contact-section {
		background: var(--color-warm-white);
	}
	.contact-inner {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 64px;
		align-items: center;
	}
	.contact-text h2 {
		margin-bottom: 12px;
	}
	.contact-text p {
		color: var(--color-muted);
		line-height: 1.7;
	}

	.contact-links {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	.contact-item {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 24px;
		background: var(--color-cream);
		border: 1px solid var(--color-tan-light);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition:
			box-shadow 0.2s,
			border-color 0.2s;
	}
	.contact-item:hover {
		box-shadow: var(--shadow-md);
		border-color: var(--color-tan);
	}
	.contact-item-cta {
		background: var(--color-bark);
		border-color: var(--color-bark);
	}
	.contact-item-cta .contact-label,
	.contact-item-cta .contact-value {
		color: rgba(255, 255, 255, 0.9);
	}

	.contact-icon {
		font-size: 1.5rem;
		margin-bottom: 8px;
	}
	.contact-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-muted);
		font-weight: 600;
	}
	.contact-value {
		font-size: 0.95rem;
		color: var(--color-charcoal);
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.alt-grid {
			grid-template-columns: 1fr;
			gap: 32px;
		}
		.alt-row:nth-child(even) .alt-img {
			order: -1;
		}
		.contact-inner {
			grid-template-columns: 1fr;
			gap: 40px;
		}
		.contact-links {
			grid-template-columns: 1fr;
		}
	}

</style>
