import { error, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { isDashboardAdmin } from '$lib/server/admin-auth';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';

function requireAdmin(locals: App.Locals) {
	if (!isDashboardAdmin(locals.user)) {
		error(403, 'Only administrators can manage users.');
	}
}

export const load: PageServerLoad = async ({ locals, request }) => {
	requireAdmin(locals);

	const result = await auth.api.listUsers({
		headers: request.headers,
		query: {
			limit: 100,
			sortBy: 'createdAt',
			sortDirection: 'desc'
		}
	});

	return {
		users: result.users,
		currentUserId: locals.user!.id
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		requireAdmin(locals);

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';
		const email = formData.get('email')?.toString().trim() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const role = formData.get('role')?.toString() ?? 'user';

		if (!name || !email || !password) {
			return fail(400, { message: 'Name, email, and password are required.' });
		}

		if (password.length < 8) {
			return fail(400, { message: 'Password must be at least 8 characters.' });
		}

		if (role !== 'admin' && role !== 'user') {
			return fail(400, { message: 'Invalid role selected.' });
		}

		try {
			await auth.api.createUser({
				headers: request.headers,
				body: { name, email, password, role }
			});
		} catch (err) {
			if (err instanceof APIError) {
				return fail(400, { message: err.message || 'Could not create user.' });
			}
			return fail(500, { message: 'Unexpected error. Please try again.' });
		}

		return { success: true };
	},

	setRole: async ({ request, locals }) => {
		requireAdmin(locals);

		const formData = await request.formData();
		const userId = formData.get('userId')?.toString() ?? '';
		const role = formData.get('role')?.toString() ?? '';

		if (!userId || (role !== 'admin' && role !== 'user')) {
			return fail(400, { message: 'Invalid request.' });
		}

		if (userId === locals.user!.id && role !== 'admin') {
			return fail(400, { message: 'You cannot remove your own admin access.' });
		}

		try {
			await auth.api.setRole({
				headers: request.headers,
				body: { userId, role }
			});
		} catch (err) {
			if (err instanceof APIError) {
				return fail(400, { message: err.message || 'Could not update role.' });
			}
			return fail(500, { message: 'Unexpected error. Please try again.' });
		}

		return { success: true };
	},

	remove: async ({ request, locals }) => {
		requireAdmin(locals);

		const userId = (await request.formData()).get('userId')?.toString() ?? '';

		if (!userId) {
			return fail(400, { message: 'Invalid request.' });
		}

		if (userId === locals.user!.id) {
			return fail(400, { message: 'You cannot delete your own account.' });
		}

		try {
			await auth.api.removeUser({
				headers: request.headers,
				body: { userId }
			});
		} catch (err) {
			if (err instanceof APIError) {
				return fail(400, { message: err.message || 'Could not delete user.' });
			}
			return fail(500, { message: 'Unexpected error. Please try again.' });
		}

		return { success: true };
	}
};
