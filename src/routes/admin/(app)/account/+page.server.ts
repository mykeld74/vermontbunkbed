import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	return { user: locals.user! };
};

export const actions: Actions = {
	changePassword: async ({ request, locals }) => {
		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword')?.toString() ?? '';
		const newPassword = formData.get('newPassword')?.toString() ?? '';
		const confirmPassword = formData.get('confirmPassword')?.toString() ?? '';

		if (!currentPassword || !newPassword || !confirmPassword) {
			return fail(400, { message: 'All password fields are required.' });
		}

		if (newPassword.length < 8) {
			return fail(400, { message: 'New password must be at least 8 characters.' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { message: 'New passwords do not match.' });
		}

		if (currentPassword === newPassword) {
			return fail(400, { message: 'New password must be different from your current password.' });
		}

		try {
			await auth.api.changePassword({
				headers: request.headers,
				body: {
					currentPassword,
					newPassword,
					revokeOtherSessions: true
				}
			});
		} catch (err) {
			if (err instanceof APIError) {
				const message =
					err.message === 'Invalid password'
						? 'Current password is incorrect.'
						: err.message || 'Could not change password.';
				return fail(400, { message });
			}
			return fail(500, { message: 'Unexpected error. Please try again.' });
		}

		return { success: true };
	}
};
