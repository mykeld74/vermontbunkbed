import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { admin } from 'better-auth/plugins';
import { getRequestEvent } from '$app/server';
import { count } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';
import { isAllowedBootstrapEmail, isAutoAdminSignupEmail } from '$lib/server/admin-auth';
import { sendEmail } from '$lib/server/email';

async function getUserCount() {
	const [result] = await db.select({ count: count() }).from(user);
	return result?.count ?? 0;
}

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: {
		enabled: true,
		revokeSessionsOnPasswordReset: true,
		sendResetPassword: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: 'Reset your Vermont Bunk Beds admin password',
				text: `Click the link to reset your password: ${url}`,
				html: `
					<p>Hi ${user.name},</p>
					<p>We received a request to reset your admin password.</p>
					<p><a href="${url}">Reset your password</a></p>
					<p>If you did not request this, you can ignore this email.</p>
					<p>This link expires in 1 hour.</p>
				`
			});
		}
	},
	databaseHooks: {
		user: {
			create: {
				before: async (newUser, ctx) => {
					if (ctx?.path !== '/sign-up/email') return;

					const userCount = await getUserCount();

					if (userCount === 0) {
						if (!isAllowedBootstrapEmail(newUser.email)) return false;

						return {
							data: {
								...newUser,
								role: 'admin'
							}
						};
					}

					if (isAutoAdminSignupEmail(newUser.email)) {
						return {
							data: {
								...newUser,
								role: 'admin'
							}
						};
					}

					return {
						data: {
							...newUser,
							role: null
						}
					};
				}
			}
		}
	},
	plugins: [
		admin({
			defaultRole: 'user',
			adminRoles: ['admin']
		}),
		sveltekitCookies(getRequestEvent)
	]
});
