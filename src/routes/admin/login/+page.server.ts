import { fail, redirect } from '@sveltejs/kit';
import { count } from 'drizzle-orm';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/admin');
	}

	const [result] = await db.select({ count: count() }).from(user);
	return {
		allowSignup: (result?.count ?? 0) === 0,
		passwordReset: event.url.searchParams.get('reset') === '1'
	};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		try {
			await auth.api.signInEmail({ body: { email, password } });
		} catch (err) {
			if (err instanceof APIError) {
				return fail(400, { message: 'Incorrect email or password.' });
			}
			return fail(500, { message: 'Unexpected error. Please try again.' });
		}

		return redirect(302, '/admin');
	}
};
