import { env } from '$env/dynamic/private';

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

export function isAutoAdminSignupEmail(email: string) {
	return getAllowedAdminEmails().includes(email.toLowerCase());
}

type RoleCarrier = { role?: string | null };

export function getDashboardRole(user: RoleCarrier | undefined): DashboardRole | null {
	if (!user?.role) return null;
	const primaryRole = user.role.split(',')[0]?.trim().toLowerCase();
	if (primaryRole === 'admin') return 'admin';
	if (primaryRole === 'user') return 'user';
	return null;
}

export function canAccessDashboard(user: RoleCarrier | undefined) {
	return getDashboardRole(user) !== null;
}

export function isDashboardAdmin(user: RoleCarrier | undefined) {
	return getDashboardRole(user) === 'admin';
}

export function isPendingUser(user: RoleCarrier | undefined) {
	return Boolean(user) && !canAccessDashboard(user);
}

export function getPostAuthRedirect(user: RoleCarrier | undefined) {
	return canAccessDashboard(user) ? '/admin' : '/admin/pending';
}
