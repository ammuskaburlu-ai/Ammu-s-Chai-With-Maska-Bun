/**
 * One-off PWA icon generator — run: node scripts/generate-pwa-icons.mjs
 * Regenerates PNG/ICO assets from public/icons/icon.svg at correct dimensions.
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const iconsDir = path.join(publicDir, "icons");
const svgPath = path.join(iconsDir, "icon.svg");

async function svgToPng(size, padding = 0) {
  const inner = size - padding * 2;
  const raster = await sharp(svgPath)
    .resize(inner, inner, { fit: "contain", background: { r: 255, g: 107, b: 53, alpha: 1 } })
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer();

  if (padding === 0) {
    return sharp(raster).resize(size, size).png({ compressionLevel: 9, palette: true, effort: 10 }).toBuffer();
  }

  return sharp(raster)
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: { r: 255, g: 107, b: 53, alpha: 1 },
    })
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer();
}

async function writePng(buffer, filePath) {
  await sharp(buffer).png({ compressionLevel: 9, palette: true, effort: 10 }).toFile(filePath);
  const meta = await sharp(filePath).metadata();
  const stat = fs.statSync(filePath);
  console.log(`  ${path.relative(root, filePath)}: ${meta.width}x${meta.height}, ${(stat.size / 1024).toFixed(1)} KB`);
}

async function main() {
  if (!fs.existsSync(svgPath)) {
    console.error("Missing source SVG:", svgPath);
    process.exit(1);
  }

  console.log("Generating PWA icons from icon.svg...\n");

  await writePng(await svgToPng(192), path.join(iconsDir, "icon-192.png"));
  await writePng(await svgToPng(512), path.join(iconsDir, "icon-512.png"));
  // Maskable: ~10% padding per adaptive-icon safe zone
  await writePng(await svgToPng(512, 52), path.join(iconsDir, "icon-maskable-512.png"));
  await writePng(await svgToPng(180), path.join(publicDir, "apple-touch-icon.png"));

  const favicon16 = await svgToPng(16);
  const favicon32 = await svgToPng(32);
  const favicon48 = await svgToPng(48);

  const { default: pngToIco } = await import("png-to-ico");
  const ico = await pngToIco([favicon16, favicon32, favicon48]);
  const faviconPath = path.join(publicDir, "favicon.ico");
  fs.writeFileSync(faviconPath, ico);
  console.log(`  ${path.relative(root, faviconPath)}: multi-size ICO, ${(ico.length / 1024).toFixed(1)} KB`);

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
