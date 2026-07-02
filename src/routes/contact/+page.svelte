<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Contact — Vermont Bunk Beds</title>
	<meta
		name="description"
		content="Get in touch with Vermont Bunk Beds. Questions about custom bunk beds, finishes, delivery, or orders — we're happy to help."
	/>
</svelte:head>

<div class="page-header">
	<div class="container">
		<p class="eyebrow">Starksboro, Vermont</p>
		<h1>Contact Us</h1>
		<p class="subhead">
			We build every bed to order and love talking with families about what they're looking for.
		</p>
	</div>
</div>

<section class="section contact-layout">
	<div class="container contact-grid">
		<aside class="contact-info">
			<h2>Reach Out</h2>
			<div class="divider" aria-hidden="true"></div>
			<p class="contact-intro">
				Whether you have a question about sizing, finishes, delivery, or a custom order — send us a
				message and we'll get back to you as soon as we can.
			</p>

			<ul class="contact-methods">
				<li>
					<span class="method-label">Phone</span>
					<a href="tel:8024480559">(802) 448-0559</a>
				</li>
				<li>
					<span class="method-label">Email</span>
					<a href="mailto:vermontbunkbeds@gmail.com">vermontbunkbeds@gmail.com</a>
				</li>
				<li>
					<span class="method-label">Location</span>
					<span>Starksboro, Vermont</span>
				</li>
			</ul>

			<div class="contact-note">
				<p>Local pickup is available at our shop in Starksboro.</p>
				<p>Typical lead time is 1–3 weeks from order.</p>
			</div>
		</aside>

		<div class="contact-form-wrap">
			{#if form?.success}
				<div class="form-success" role="status">
					<h2>Message sent</h2>
					<p>Thanks for reaching out. We'll be in touch soon.</p>
					<a href="/collections" class="btn btn-primary">Browse Collections</a>
				</div>
			{:else}
				<form
					class="contact-form"
					method="post"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							await update();
						};
					}}
				>
					<div class="form-row">
						<label>
							<span class="field-label">Name <span class="required">*</span></span>
							<input
								type="text"
								name="name"
								required
								maxlength="100"
								autocomplete="name"
								value={form?.name ?? ''}
							/>
						</label>
						<label>
							<span class="field-label">Email <span class="required">*</span></span>
							<input
								type="email"
								name="email"
								required
								autocomplete="email"
								value={form?.email ?? ''}
							/>
						</label>
					</div>

					<label>
						<span class="field-label">Phone <span class="optional">(optional)</span></span>
						<input
							type="tel"
							name="phone"
							autocomplete="tel"
							value={form?.phone ?? ''}
						/>
					</label>

					<label>
						<span class="field-label">Subject <span class="required">*</span></span>
						<input
							type="text"
							name="subject"
							required
							maxlength="150"
							placeholder="e.g. Question about twin-over-full sizing"
							value={form?.subject ?? ''}
						/>
					</label>

					<label>
						<span class="field-label">Message <span class="required">*</span></span>
						<textarea
							name="message"
							required
							rows="6"
							maxlength="5000"
							placeholder="Tell us what you're looking for…"
						>{form?.message ?? ''}</textarea>
					</label>

					<!-- Honeypot for bots -->
					<div class="hp" aria-hidden="true">
						<label>
							Website
							<input type="text" name="website" tabindex="-1" autocomplete="off" />
						</label>
					</div>

					{#if form?.error}
						<p class="form-error" role="alert">{form.error}</p>
					{/if}

					<button type="submit" class="btn btn-primary" disabled={loading}>
						{loading ? 'Sending…' : 'Send Message'}
					</button>
				</form>
			{/if}
		</div>
	</div>
</section>

<style>
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

	.page-header h1 {
		color: #fff;
		margin-bottom: 16px;
	}

	.subhead {
		color: rgba(255, 255, 255, 0.65);
		font-size: 1.1rem;
		max-width: 520px;
		margin: 0 auto;
	}

	.contact-grid {
		display: grid;
		grid-template-columns: 1fr 1.2fr;
		gap: 64px;
		align-items: start;
	}

	.contact-info h2 {
		margin-bottom: 8px;
	}

	.divider {
		width: 48px;
		height: 3px;
		background: var(--color-tan);
		border-radius: 2px;
		margin: 16px 0 24px;
	}

	.contact-intro {
		color: var(--color-muted);
		line-height: 1.8;
		margin-bottom: 32px;
	}

	.contact-methods {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: 32px;
	}

	.contact-methods li {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.method-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-muted);
		font-weight: 600;
	}

	.contact-methods a {
		color: var(--color-bark);
		font-weight: 500;
		text-decoration: none;
	}

	.contact-methods a:hover {
		text-decoration: underline;
	}

	.contact-note {
		padding: 20px;
		background: var(--color-cream);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-tan-light);
	}

	.contact-note p {
		font-size: 0.9rem;
		color: var(--color-muted);
		line-height: 1.6;
		margin: 0;
	}

	.contact-note p + p {
		margin-top: 8px;
	}

	.contact-form-wrap {
		background: var(--color-warm-white);
		border: 1px solid var(--color-tan-light);
		border-radius: var(--radius-md);
		padding: 36px;
		box-shadow: var(--shadow-md);
	}

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.contact-form label {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.field-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-charcoal);
	}

	.required {
		color: var(--color-bark);
		font-weight: 400;
	}

	.optional {
		color: var(--color-muted);
		font-weight: 400;
	}

	.contact-form input,
	.contact-form textarea {
		padding: 12px 14px;
		border: 1px solid var(--color-tan-light);
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
		font-family: inherit;
		background: #fff;
		color: var(--color-charcoal);
		transition: border-color 0.2s;
	}

	.contact-form input:focus,
	.contact-form textarea:focus {
		outline: none;
		border-color: var(--color-bark);
	}

	.contact-form textarea {
		resize: vertical;
		min-height: 140px;
	}

	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.form-error {
		font-size: 0.9rem;
		color: #c0392b;
		background: #fef0ee;
		border: 1px solid #fbd5cf;
		border-radius: var(--radius-sm);
		padding: 12px 14px;
		margin: 0;
	}

	.contact-form .btn {
		align-self: flex-start;
		cursor: pointer;
		border: none;
	}

	.contact-form .btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.form-success {
		text-align: center;
		padding: 24px 0;
	}

	.form-success h2 {
		margin-bottom: 12px;
	}

	.form-success p {
		color: var(--color-muted);
		margin-bottom: 28px;
		line-height: 1.7;
	}

	@media (max-width: 900px) {
		.contact-grid {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.form-row {
			grid-template-columns: 1fr;
		}

		.contact-form-wrap {
			padding: 28px 24px;
		}
	}
</style>
