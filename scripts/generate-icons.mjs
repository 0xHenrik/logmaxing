import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const staticDir = resolve(__dirname, '..', 'static');
const assetsDir = resolve(__dirname, '..', 'src', 'lib', 'assets');

// Brand SVG: purple "L" on dark rounded background
const brandSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#09090b"/>
  <text x="256" y="370" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="360" fill="#a855f7">L</text>
</svg>`;

const sizes = [
	{ name: 'apple-touch-icon.png', size: 180 },
	{ name: 'android-chrome-192x192.png', size: 192 },
	{ name: 'android-chrome-512x512.png', size: 512 },
	{ name: 'favicon-32x32.png', size: 32 },
	{ name: 'favicon-16x16.png', size: 16 }
];

for (const { name, size } of sizes) {
	const buf = await sharp(Buffer.from(brandSvg)).resize(size, size).png().toBuffer();

	writeFileSync(resolve(staticDir, name), buf);
	console.log(`Created static/${name} (${size}x${size})`);
}

// Also replace the default Svelte favicon with a branded one
writeFileSync(resolve(assetsDir, 'favicon.svg'), brandSvg);
console.log('Created src/lib/assets/favicon.svg (branded)');

console.log('\nDone!');
