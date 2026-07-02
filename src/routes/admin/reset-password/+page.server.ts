import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { getPostAuthRedirect } from '$lib/server/admin-auth';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.user) {
		return redirect(302, getPostAuthRedirect(locals.user));
	}

	const token = url.searchParams.get('token');
	const error = url.searchParams.get('error');

	if (error === 'INVALID_TOKEN') {
		return { token: null, invalid: true };
	}

	return { token, invalid: !token };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const password = formData.get('password')?.toString() ?? '';
		const token = formData.get('token')?.toString() ?? '';

		if (!token) {
			return fail(400, { message: 'Reset link is invalid or expired.' });
		}

		if (password.length < 8) {
			return fail(400, { message: 'Password must be at least 8 characters.' });
		}

		try {
			await auth.api.resetPassword({
				body: { newPassword: password, token }
			});
		} catch (err) {
			if (err instanceof APIError) {
				return fail(400, { message: err.message || 'Could not reset password.' });
			}
			return fail(500, { message: 'Unexpected error. Please try again.' });
		}

		return redirect(302, '/admin/login?reset=1');
	}
};
