import "server-only";

import sharp from "sharp";

/**
 * Link preview cards, encoded small enough that the platforms will fetch them.
 *
 * `ImageResponse` only emits PNG, and a PNG of a photograph at 1200x630 is
 * 500KB to 900KB. WhatsApp will not download a preview image much over 300KB:
 * it fetches the page, reads the tags, decides the image is too big and shows
 * a bare title instead. That is exactly what shipped, and the tags looked
 * perfect the whole time, which is what made it hard to see.
 *
 * So the card is rendered as before and re-encoded as JPEG on the way out.
 * Album artwork is photographic, which is what JPEG is for: the same card
 * lands around 150KB with no visible difference at preview size.
 */

export const OG_SIZE = { width: 1200, height: 630 };

/** Drives `og:image:type`. Must match what `asJpeg` actually returns. */
export const OG_CONTENT_TYPE = "image/jpeg";

/**
 * Quality 82 is the point where the starfield stops showing banding. Below
 * about 78 the gradient behind the artwork starts to posterise, and it is a
 * false economy: the difference between 82 and 70 is some tens of kilobytes
 * against a budget of 300.
 */
const JPEG_QUALITY = 82;

export async function asJpeg(
  image: Response,
  cacheSeconds: number
): Promise<Response> {
  const png = Buffer.from(await image.arrayBuffer());
  const jpeg = await sharp(png)
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "content-type": OG_CONTENT_TYPE,
      "cache-control": `public, max-age=${cacheSeconds}, immutable`,
    },
  });
}
