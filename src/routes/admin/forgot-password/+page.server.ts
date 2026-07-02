import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	if (event.locals.user) {
		return redirect(302, '/admin');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const email = (await event.request.formData()).get('email')?.toString().trim() ?? '';

		if (!email) {
			return fail(400, { message: 'Email is required.' });
		}

		try {
			await auth.api.requestPasswordReset({
				body: {
					email,
					redirectTo: `${env.ORIGIN}/admin/reset-password`
				}
			});
		} catch (err) {
			if (err instanceof APIError) {
				return fail(400, { message: err.message || 'Could not send reset email.' });
			}
			return fail(500, { message: 'Unexpected error. Please try again.' });
		}

		return { success: true, email };
	}
};
