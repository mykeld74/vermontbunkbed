/**
 * Generate favicon assets from the site logo.
 *
 * Usage: pnpm generate:favicons
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import toIco from 'to-ico';

const root = resolve(import.meta.dirname, '..');
const logoPath = resolve(root, 'src/lib/assets/logo.webp');
const staticDir = resolve(root, 'static');

const logo = readFileSync(logoPath);

const icoPngs = await Promise.all(
	[16, 32, 48].map((size) => sharp(logo).resize(size, size, { fit: 'cover' }).png().toBuffer())
);

const faviconIco = await toIco(icoPngs);
const faviconWebp = await sharp(logo).resize(128, 128, { fit: 'cover' }).webp().toBuffer();
const appleTouchIcon = await sharp(logo).resize(180, 180, { fit: 'cover' }).png().toBuffer();
const faviconPngForSvg = await sharp(logo).resize(128, 128, { fit: 'cover' }).png().toBuffer();

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <image width="128" height="128" href="data:image/png;base64,${faviconPngForSvg.toString('base64')}" />
</svg>
`;

writeFileSync(resolve(staticDir, 'favicon.ico'), faviconIco);
writeFileSync(resolve(staticDir, 'favicon.webp'), faviconWebp);
writeFileSync(resolve(staticDir, 'favicon.svg'), faviconSvg);
writeFileSync(resolve(staticDir, 'apple-touch-icon.png'), appleTouchIcon);

console.log('Generated favicons from src/lib/assets/logo.webp');
