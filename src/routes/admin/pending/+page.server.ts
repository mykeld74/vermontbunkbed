import { redirect } from '@sveltejs/kit';
import { canAccessDashboard } from '$lib/server/admin-auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/admin/login');
	}

	if (canAccessDashboard(locals.user)) {
		return redirect(302, '/admin');
	}

	return {
		user: locals.user
	};
};
