/**
 * Seeds water stain and Natura milk paint finish documents into Sanity,
 * uploading the cropped swatch images from src/lib/assets/.
 *
 * Prerequisites:
 *   1. Add SANITY_WRITE_TOKEN to .env (create a token in sanity.io → API → Tokens)
 *   2. Run: npx tsx scripts/seed-finishes.ts
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({
	projectId: process.env.PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.PUBLIC_SANITY_DATASET!,
	apiVersion: '2024-01-01',
	token: process.env.SANITY_WRITE_TOKEN!,
	useCdn: false,
});

const ASSETS_ROOT = path.join(process.cwd(), 'src/lib/assets');

// ---------------------------------------------------------------------------
// Water stains — General Finishes water-based stains on Maple
// ---------------------------------------------------------------------------
const WATER_STAINS = [
	{ name: 'White Wash', file: 'stains/whitewash-maple.jpg' },
	{ name: 'Natural', file: 'stains/natural-maple.jpg' },
	{ name: 'Antique Oak', file: 'stains/antique-oak-maple.jpg' },
	{ name: 'Graystone', file: 'stains/graystone-maple.jpg' },
	{ name: 'Hickory', file: 'stains/hickory-maple.jpg' },
	{ name: 'Antique Brown', file: 'stains/antique-brown-maple.jpg' },
	{ name: 'Brown Mahogany', file: 'stains/brown-mahogany-maple.jpg' },
	{ name: 'Provincial', file: 'stains/provincial-maple.jpg' },
	{ name: 'Onyx', file: 'stains/onyx-maple.jpg' },
	{ name: 'Black', file: 'stains/black-maple.jpg' },
	{ name: 'Walnut', file: 'stains/walnut-maple.jpg' },
	{ name: 'Pecan', file: 'stains/pecan-maple.jpg' },
	{ name: 'Black Cherry', file: 'stains/black-cherry-maple.jpg' },
	{ name: 'Sedona', file: 'stains/sedona-maple.jpg' },
	{ name: 'Cabernet', file: 'stains/cabernet-maple.jpg' },
	{ name: 'Tobacco', file: 'stains/tobacco-maple.jpg' },
	{ name: 'Espresso', file: 'stains/espresso-maple.jpg' },
	{ name: 'Graphite', file: 'stains/graphite-maple.jpg' },
];

// ---------------------------------------------------------------------------
// Benjamin Moore Natura milk paint colors
// ---------------------------------------------------------------------------
const NATURA_SWATCHES = [
	{ name: 'Snow White', file: 'natura/snow-white.png' },
	{ name: 'Alabaster', file: 'natura/alabaster.png' },
	{ name: 'Antique White', file: 'natura/antique-white.png' },
	{ name: 'Linen', file: 'natura/linen.png' },
	{ name: 'Reverent Gray', file: 'natura/reverent-gray.png' },
	{ name: 'Millstone', file: 'natura/millstone.png' },
	{ name: 'Empire Gray', file: 'natura/empire-gray.png' },
	{ name: 'Perfect Gray', file: 'natura/perfect-gray.png' },
	{ name: 'Seagull Gray', file: 'natura/seagull-gray.png' },
	{ name: 'Driftwood', file: 'natura/driftwood.png' },
	{ name: 'Queenstown Gray', file: 'natura/queenstown-gray.png' },
	{ name: 'Dark Chocolate', file: 'natura/dark-chocolate.png' },
	{ name: 'Lamp Black', file: 'natura/lamp-black.png' },
	{ name: 'Coastal Blue', file: 'natura/coastal-blue.png' },
	{ name: 'Twilight', file: 'natura/twilight.png' },
	{ name: 'China Blue', file: 'natura/china-blue.png' },
	{ name: 'Klein Blue', file: 'natura/klein-blue.png' },
	{ name: 'Blue Moon', file: 'natura/blue-moon.png' },
	{ name: 'Halcyon Blue', file: 'natura/halcyon-blue.png' },
	{ name: 'Persian Blue', file: 'natura/persian-blue.png' },
	{ name: 'Gulf Stream Blue', file: 'natura/gulf-stream-blue.png' },
	{ name: 'Key West Blue', file: 'natura/key-west-blue.png' },
	{ name: 'Patina Green', file: 'natura/patina-green.png' },
	{ name: 'Basil', file: 'natura/basil.png' },
	{ name: 'Emerald', file: 'natura/emerald.png' },
	{ name: 'Westminster Green', file: 'natura/westminster-green.png' },
	{ name: 'Ballet Pink', file: 'natura/ballet-pink.png' },
	{ name: 'Coral Crush', file: 'natura/coral-crush.png' },
	{ name: 'Holiday Red', file: 'natura/holiday-red.png' },
	{ name: 'Tuscan Red', file: 'natura/tuscan-red.png' },
	{ name: 'Harvest Yellow', file: 'natura/harvest-yellow.png' },
	{ name: 'Sunglow', file: 'natura/sunglow.png' },
	{ name: 'Persimmon', file: 'natura/persimmon.png' },
];

function slugify(name: string) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function uploadImage(filePath: string): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } }> {
	const fullPath = path.join(ASSETS_ROOT, filePath);
	const buffer = fs.readFileSync(fullPath);
	const filename = path.basename(filePath);
	const ext = path.extname(filePath).toLowerCase();
	const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
	const asset = await client.assets.upload('image', buffer, {
		filename,
		contentType,
	});
	return {
		_type: 'image',
		asset: { _type: 'reference', _ref: asset._id },
	};
}

async function upsertFinish(name: string, file: string, category: string, priceModifier = 0) {
	const slug = slugify(name);
	console.log(`  Upserting: ${name} (${slug})`);

	const image = await uploadImage(file);

	await client.createOrReplace({
		_type: 'finish',
		_id: `finish-${slug}`,
		name,
		slug: { _type: 'slug', current: slug },
		description: `${category} — ${name}`,
		image,
		priceModifier,
	});
}

async function main() {
	console.log('Seeding water stains…');
	for (const s of WATER_STAINS) {
		await upsertFinish(s.name, s.file, 'Water Stain');
	}

	console.log('\nSeeding Natura milk paint…');
	for (const s of NATURA_SWATCHES) {
		await upsertFinish(s.name, s.file, 'Benjamin Moore Natura');
	}

	console.log('\nDone.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
