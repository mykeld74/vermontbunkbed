import { env } from '$env/dynamic/private';

type SendEmailInput = {
	to: string;
	subject: string;
	html: string;
	text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailInput) {
	const apiKey = env.RESEND_API_KEY;
	const from = env.EMAIL_FROM;

	if (!apiKey || !from) {
		console.warn('[email] RESEND_API_KEY or EMAIL_FROM not set. Email not sent.');
		console.info(`[email] To: ${to}\nSubject: ${subject}\n${text ?? html}`);
		return;
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			from,
			to,
			subject,
			html,
			text
		})
	});

	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Failed to send email (${response.status}): ${body}`);
	}
}
