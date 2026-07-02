import { env } from '$env/dynamic/private';
import type { UserWithRole } from 'better-auth/plugins';

export type DashboardRole = 'admin' | 'user';

export function getAllowedAdminEmails() {
	return (env.ADMIN_EMAILS ?? '')
		.split(',')
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);
}

export function isAllowedBootstrapEmail(email: string) {
	const allowed = getAllowedAdminEmails();
	if (allowed.length === 0) return true;
	return allowed.includes(email.toLowerCase());
}

export function getDashboardRole(user: Pick<UserWithRole, 'role'> | undefined): DashboardRole | null {
	if (!user?.role) return null;
	const primaryRole = user.role.split(',')[0]?.trim().toLowerCase();
	if (primaryRole === 'admin') return 'admin';
	if (primaryRole === 'user') return 'user';
	return null;
}

export function canAccessDashboard(user: Pick<UserWithRole, 'role'> | undefined) {
	return getDashboardRole(user) !== null;
}

export function isDashboardAdmin(user: Pick<UserWithRole, 'role'> | undefined) {
	return getDashboardRole(user) === 'admin';
}
