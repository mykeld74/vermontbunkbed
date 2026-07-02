/**
 * Reset an admin user's password directly in the database.
 * Use when email reset isn't configured yet.
 *
 * Usage:
 *   pnpm tsx scripts/reset-admin-password.ts user@example.com "new-password"
 */

import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { hashPassword } from 'better-auth/crypto';

config();

const email = process.argv[2]?.trim().toLowerCase();
const newPassword = process.argv[3];

if (!email || !newPassword) {
	console.error('Usage: pnpm tsx scripts/reset-admin-password.ts <email> <new-password>');
	process.exit(1);
}

if (newPassword.length < 8) {
	console.error('Password must be at least 8 characters.');
	process.exit(1);
}

if (!process.env.DATABASE_URL) {
	console.error('DATABASE_URL is not set.');
	process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const users = await sql`
	SELECT id, email, name, role
	FROM "user"
	WHERE email = ${email}
`;

if (users.length === 0) {
	console.error(`No user found for ${email}`);
	process.exit(1);
}

const userId = users[0].id;
const hashedPassword = await hashPassword(newPassword);

const accounts = await sql`
	SELECT id
	FROM account
	WHERE user_id = ${userId} AND provider_id = 'credential'
`;

if (accounts.length === 0) {
	console.error(`No credential account found for ${email}`);
	process.exit(1);
}

await sql`
	UPDATE account
	SET password = ${hashedPassword}, updated_at = NOW()
	WHERE user_id = ${userId} AND provider_id = 'credential'
`;

await sql`
	UPDATE "user"
	SET role = COALESCE(role, 'admin'), banned = false, ban_reason = NULL, ban_expires = NULL
	WHERE id = ${userId}
`;

await sql`
	DELETE FROM session
	WHERE user_id = ${userId}
`;

console.log(`Password reset for ${users[0].name} <${users[0].email}>`);
console.log('You can sign in at /admin/login with the new password.');
