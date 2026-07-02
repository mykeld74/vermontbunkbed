import { fail, redirect } from '@sveltejs/kit';
import { count, eq } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { getPostAuthRedirect } from '$lib/server/admin-auth';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';

async function getUserCount() {
	const [result] = await db.select({ count: count() }).from(user);
	return result?.count ?? 0;
}

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, getPostAuthRedirect(event.locals.user));
	}

	return {
		isBootstrap: (await getUserCount()) === 0
	};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString().trim() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const name = formData.get('name')?.toString().trim() ?? '';

		try {
			await auth.api.signUpEmail({ body: { email, password, name } });
		} catch (err) {
			if (err instanceof APIError) {
				return fail(400, {
					message:
						err.message ||
						'Could not create account. The email may already be in use or not authorized for the first admin account.'
				});
			}
			return fail(500, { message: 'Unexpected error. Please try again.' });
		}

		const [createdUser] = await db
			.select({ role: user.role })
			.from(user)
			.where(eq(user.email, email));

		return redirect(302, getPostAuthRedirect(createdUser));
	}
};
