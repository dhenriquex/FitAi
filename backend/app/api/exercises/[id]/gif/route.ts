import { NextResponse } from "next/server";
import { existsSync } from "fs";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const CACHE_DIR = path.join(process.cwd(), "cache", "gifs");

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const cachePath = path.join(CACHE_DIR, `${id}.gif`);

  if (existsSync(cachePath)) {
    const buffer = await readFile(cachePath);
    return new NextResponse(buffer, {
      headers: { "Content-Type": "image/gif" },
    });
  }

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
    return NextResponse.json({ error: "GIF não encontrado" }, { status: 404 });
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);


  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(cachePath, buffer);

  return new NextResponse(buffer, {
    headers: { "Content-Type": "image/gif" },
  });
}