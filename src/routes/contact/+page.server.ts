import { fail } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/server/contact';
import type { Actions } from './$types';

const MAX_NAME = 100;
const MAX_SUBJECT = 150;
const MAX_MESSAGE = 5000;

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		// Honeypot — bots that fill this field are silently accepted.
		if (formData.get('website')?.toString()) {
			return { success: true };
		}

		const name = formData.get('name')?.toString().trim() ?? '';
		const email = formData.get('email')?.toString().trim() ?? '';
		const phone = formData.get('phone')?.toString().trim() ?? '';
		const subject = formData.get('subject')?.toString().trim() ?? '';
		const message = formData.get('message')?.toString().trim() ?? '';

		if (!name || !email || !subject || !message) {
			return fail(400, { error: 'Please fill in all required fields.', name, email, phone, subject, message });
		}

		if (name.length > MAX_NAME) {
			return fail(400, { error: 'Name is too long.', name, email, phone, subject, message });
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, { error: 'Please enter a valid email address.', name, email, phone, subject, message });
		}

		if (subject.length > MAX_SUBJECT) {
			return fail(400, { error: 'Subject is too long.', name, email, phone, subject, message });
		}

		if (message.length > MAX_MESSAGE) {
			return fail(400, { error: 'Message is too long.', name, email, phone, subject, message });
		}

		try {
			await sendContactEmail({ name, email, phone: phone || undefined, subject, message });
		} catch (err) {
			console.error('[contact] Failed to send message:', err);
			return fail(500, {
				error:
					'Something went wrong sending your message. Please try again or call us directly.',
				name,
				email,
				phone,
				subject,
				message
			});
		}

		return { success: true };
	}
};
