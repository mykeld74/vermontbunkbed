import { fail, redirect } from '@sveltejs/kit';
import { count } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';

async function getUserCount() {
	const [result] = await db.select({ count: count() }).from(user);
	return result?.count ?? 0;
}

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/admin');
	}

	const userCount = await getUserCount();
	if (userCount > 0) {
		return redirect(302, '/admin/login');
	}

	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const userCount = await getUserCount();
		if (userCount > 0) {
			return fail(403, { message: 'Account creation is disabled. Ask an administrator to invite you.' });
		}

		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const name = formData.get('name')?.toString() ?? '';

		try {
			await auth.api.signUpEmail({ body: { email, password, name } });
		} catch (err) {
			if (err instanceof APIError) {
				return fail(400, {
					message:
						'Could not create account. Make sure this email is authorized for the first admin account, and that an account does not already exist.'
				});
			}
			return fail(500, { message: 'Unexpected error. Please try again.' });
		}

		return redirect(302, '/admin');
	}
};
