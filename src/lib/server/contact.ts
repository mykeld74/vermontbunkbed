import { env } from '$env/dynamic/private';
import { sendEmail } from '$lib/server/email';

export type ContactFormData = {
	name: string;
	email: string;
	phone?: string;
	subject: string;
	message: string;
};

function getContactRecipient() {
	return env.CONTACT_EMAIL?.trim() || env.ADMIN_EMAILS?.split(',')[0]?.trim() || '';
}

export async function sendContactEmail(data: ContactFormData) {
	const to = getContactRecipient();
	const subject = `Contact form: ${data.subject}`;
	const text = [
		`Name: ${data.name}`,
		`Email: ${data.email}`,
		data.phone ? `Phone: ${data.phone}` : null,
		`Subject: ${data.subject}`,
		'',
		data.message
	]
		.filter(Boolean)
		.join('\n');

	const html = `
		<p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
		<p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
		${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ''}
		<p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
		<hr />
		<p>${escapeHtml(data.message).replace(/\n/g, '<br />')}</p>
	`;

	if (!to) {
		console.warn('[contact] CONTACT_EMAIL not set. Message logged but not emailed.');
		console.info(`[contact]\n${text}`);
		return;
	}

	await sendEmail({ to, subject, html, text });
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}
