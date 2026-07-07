import { NextResponse } from "next/server";
import { existsSync } from "fs";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const GIF_CACHE_DIR = path.join(process.cwd(), "cache", "gifs");
const THUMB_CACHE_DIR = path.join(process.cwd(), "cache", "thumbnails");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const thumbCachePath = path.join(THUMB_CACHE_DIR, `${id}.webp`);

    if (existsSync(thumbCachePath)) {
      const buffer = await readFile(thumbCachePath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // reaproveita o gif já cacheado em disco, se existir, pra não bater na RapidAPI de novo
    const gifCachePath = path.join(GIF_CACHE_DIR, `${id}.gif`);
    let sourceBuffer: Buffer;

    if (existsSync(gifCachePath)) {
      sourceBuffer = await readFile(gifCachePath);
    } else {
      const response = await fetch(
        `https://exercisedb.p.rapidapi.com/image?exerciseId=${id}&resolution=180`,
        {
          headers: {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        console.error(
          `Gif de origem não encontrado pro exercício ${id}: status ${response.status}`
        );
        return NextResponse.json(
          { error: "Thumbnail não encontrada" },
          { status: 404 }
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      sourceBuffer = Buffer.from(arrayBuffer);

      // salva também no cache de gifs, já que buscamos ele mesmo assim
      await mkdir(GIF_CACHE_DIR, { recursive: true });
      await writeFile(gifCachePath, sourceBuffer);
    }

    // extrai só o primeiro frame e converte pra webp, bem mais leve que o gif animado
    const thumbnailBuffer = await sharp(sourceBuffer, { animated: false })
      .resize(112, 112, { fit: "cover" })
      .webp({ quality: 70 })
      .toBuffer();

    await mkdir(THUMB_CACHE_DIR, { recursive: true });
    await writeFile(thumbCachePath, thumbnailBuffer);

    return new NextResponse(thumbnailBuffer, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar thumbnail:", error);
    return NextResponse.json(
      { error: "Erro ao gerar thumbnail" },
      { status: 500 }
    );
  }
}