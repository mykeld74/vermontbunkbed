import { redirect, error } from '@sveltejs/kit';
import { canAccessDashboard, getDashboardRole, isDashboardAdmin } from '$lib/server/admin-auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return redirect(302, '/admin/login');
	}
	if (!canAccessDashboard(locals.user)) {
		error(403, 'Your account does not have access to the admin dashboard.');
	}
	return {
		user: locals.user,
		role: getDashboardRole(locals.user),
		isAdmin: isDashboardAdmin(locals.user)
	};
};
