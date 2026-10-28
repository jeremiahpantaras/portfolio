// Generates responsive WebP derivatives for the portfolio's large source images.
//
// Usage:  node scripts/optimize-images.mjs [--force]
// Needs the `cwebp` binary on PATH (macOS: `brew install webp`). No npm dependency.
//
// Originals are never modified. Derivatives are written to public/images/**, and
// their pixel sizes are recorded in src/data/imageMeta.json so <img> tags can
// carry width/height (prevents layout shift).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');

// Reads width/height from a WebP header (lossy VP8, lossless VP8L, extended VP8X).
// Also reads PNG, because some source files (e.g. project1.webp) are PNGs with a .webp extension.
function webpSize(file) {
  const b = readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error(`${file} is neither a WebP nor a PNG file`);
  }
  const kind = b.toString('ascii', 12, 16);
  if (kind === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  if (kind === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (kind === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  throw new Error(`${file}: unsupported WebP chunk ${kind}`);
}

const abs = (p) => path.join(root, p);
const meta = {};
let made = 0;
let skipped = 0;

// job: { src, out, width? , fit? , q, crop? }
//   width: scale to this width (never upscales). fit: scale so the longest side is this.
function run(job) {
  const src = abs(job.src);
  const out = abs(job.out);
  if (!existsSync(src)) throw new Error(`Missing source: ${job.src}`);
  mkdirSync(path.dirname(out), { recursive: true });

  const fresh = existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs;
  if (!fresh || force) {
    const full = webpSize(src);
    const base = job.crop ? { w: job.crop[2], h: job.crop[3] } : full;
    let scale = 1;
    if (job.width) scale = Math.min(1, job.width / base.w);
    if (job.fit) scale = Math.min(1, job.fit / Math.max(base.w, base.h));
    const args = ['-quiet', '-q', String(job.q), '-m', '6'];
    if (job.crop) args.push('-crop', ...job.crop.map(String));
    if (scale < 1) args.push('-resize', String(Math.round(base.w * scale)), String(Math.round(base.h * scale)));
    args.push(src, '-o', out);
    execFileSync('cwebp', args, { stdio: ['ignore', 'ignore', 'inherit'] });
    made++;
  } else {
    skipped++;
  }
  const { w, h } = webpSize(out);
  meta['/' + path.relative(abs('public'), out).split(path.sep).join('/')] = { w, h };
}

const range = (n) => Array.from({ length: n }, (_, i) => i + 1);

// Portrait (above the fold on the home page)
for (const width of [640, 1200]) {
  run({ src: 'public/profile/darkMode.webp', out: `public/images/portrait/portrait-${width}.webp`, width, q: 78 });
}

// Creative gallery. Image 10 is stored on disk as "10 2.webp"; the derivative is named 10-*.webp.
for (const n of range(20)) {
  const name = n === 10 && !existsSync(abs('public/creative-assets/creative-gallery/10.webp')) ? '10 2.webp' : `${n}.webp`;
  const src = `public/creative-assets/creative-gallery/${name}`;
  run({ src, out: `public/images/creative/${n}-800.webp`, width: 800, q: 74 });
  run({ src, out: `public/images/creative/${n}-2000.webp`, fit: 2000, q: 80 });
}

// Creative hero background
run({ src: 'src/assets/images/hero-background.webp', out: 'public/images/hero/hero-bg-1600.webp', width: 1600, q: 70 });

const sorted = Object.fromEntries(Object.entries(meta).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })));
mkdirSync(abs('src/data'), { recursive: true });
writeFileSync(abs('src/data/imageMeta.json'), JSON.stringify(sorted, null, 2) + '\n');
console.log(`Derivatives: ${made} written, ${skipped} up to date. Meta entries: ${Object.keys(sorted).length}`);
