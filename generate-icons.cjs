#!/usr/bin/env node
// Generates extension icons as PNG files using only Node.js built-ins.
// Run: node generate-icons.js

const zlib = require('zlib');
const fs = require('fs');

// --- CRC32 ---
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// --- PNG builder ---
function pngChunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

function makePNG(size, drawPixel) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA

  const stride = size * 4 + 1;
  const raw = Buffer.alloc(stride * size, 0);
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = drawPixel(x, y, size);
      const i = y * stride + 1 + x * 4;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b; raw[i + 3] = a;
    }
  }

  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Geometry helpers ---
function inRoundedRect(x, y, l, t, r, b, rx) {
  if (x < l || x > r || y < t || y > b) return false;
  if (x < l + rx && y < t + rx) return Math.hypot(x - (l + rx), y - (t + rx)) <= rx;
  if (x > r - rx && y < t + rx) return Math.hypot(x - (r - rx), y - (t + rx)) <= rx;
  if (x < l + rx && y > b - rx) return Math.hypot(x - (l + rx), y - (b - rx)) <= rx;
  if (x > r - rx && y > b - rx) return Math.hypot(x - (r - rx), y - (b - rx)) <= rx;
  return true;
}

// --- Icon draw function ---
// Design: indigo rounded square + white open book
function drawIcon(x, y, size) {
  const s = size;
  const pad = s * 0.05;
  const cr = s * 0.2;

  // Background rounded rect
  if (!inRoundedRect(x, y, pad, pad, s - 1 - pad, s - 1 - pad, cr)) {
    return [0, 0, 0, 0]; // transparent outside
  }

  // Indigo: #6366f1 = (99, 102, 241)
  const BG = [99, 102, 241, 255];
  const WHITE = [255, 255, 255, 255];
  const SPINE_COLOR = [150, 153, 245, 255]; // lighter indigo for spine area

  // Book geometry (proportional to size)
  const bT = s * 0.22;
  const bB = s * 0.80;
  const bL = s * 0.14;
  const bR = s * 0.86;
  const mid = s * 0.50;
  const spineHalf = Math.max(0.8, s * 0.025);
  const borderW = Math.max(1, s * 0.045);

  const inLeftPage  = x >= bL && x < mid - spineHalf && y >= bT && y <= bB;
  const inRightPage = x >  mid + spineHalf && x <= bR && y >= bT && y <= bB;
  const inSpine     = x >= mid - spineHalf && x <= mid + spineHalf && y >= bT && y <= bB;

  if (inSpine) return SPINE_COLOR;

  if (inLeftPage) {
    // Page border: left, top, bottom edges
    const onBorder =
      x <= bL + borderW ||
      y <= bT + borderW ||
      y >= bB - borderW;
    if (onBorder) return WHITE;

    // Text lines on the page (only at larger sizes)
    if (size >= 48) {
      const lineW = Math.max(1, s * 0.04);
      const lineX0 = bL + borderW * 2;
      const lineX1 = mid - spineHalf - borderW;
      const linePcts = [0.35, 0.52, 0.68];
      for (const pct of linePcts) {
        const lineY = bT + (bB - bT) * pct;
        if (y >= lineY - lineW / 2 && y <= lineY + lineW / 2 && x >= lineX0 && x <= lineX1) {
          return WHITE;
        }
      }
    }
    return BG;
  }

  if (inRightPage) {
    // Page border: right, top, bottom edges
    const onBorder =
      x >= bR - borderW ||
      y <= bT + borderW ||
      y >= bB - borderW;
    if (onBorder) return WHITE;

    // Text lines on the page (only at larger sizes)
    if (size >= 48) {
      const lineW = Math.max(1, s * 0.04);
      const lineX0 = mid + spineHalf + borderW;
      const lineX1 = bR - borderW * 2;
      const linePcts = [0.35, 0.52, 0.68];
      for (const pct of linePcts) {
        const lineY = bT + (bB - bT) * pct;
        if (y >= lineY - lineW / 2 && y <= lineY + lineW / 2 && x >= lineX0 && x <= lineX1) {
          return WHITE;
        }
      }
    }
    return BG;
  }

  return BG;
}

// --- Generate ---
for (const size of [16, 48, 128]) {
  const png = makePNG(size, drawIcon);
  const outPath = `icons/icon${size}.png`;
  fs.writeFileSync(outPath, png);
  console.log(`Generated ${outPath} (${size}x${size})`);
}
