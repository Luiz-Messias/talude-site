// Build script to copy Speed Insights to assets
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Copy the Speed Insights script to assets
const sourceFile = join(__dirname, 'node_modules/@vercel/speed-insights/dist/index.mjs');
const destDir = join(__dirname, 'assets');
const destFile = join(destDir, 'speed-insights.js');

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

copyFileSync(sourceFile, destFile);
console.log('Speed Insights script copied to assets/speed-insights.js');
