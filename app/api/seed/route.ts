import { NextResponse } from "next/server";
import payload from "payload";
import config from "@payload-config";
import { CollectionSlug } from "payload";

// Seed data
import {
  seedSizes,
  seedMaterials,
  seedFrameColors,
  seedHangOptions,
} from "@/payload/seed/seedData";

async function initPayloadOnce() {
  try {
    await payload.init({ config });
  } catch {
    // ignore if already initialized
  }
}

async function ensureDoc(collection: CollectionSlug, where: any, data: any) {
  const existing = await payload.find({ collection, where, limit: 1 });
  if (existing?.docs?.length) return existing.docs[0];
  return payload.create({ collection, data });
}

export async function POST() {
  try {
    await initPayloadOnce();

    const results: Record<string, number> = {
      sizes: 0,
      materials: 0,
      "frame-colors": 0,
      "hang-options": 0,
    };

    for (const item of seedSizes) {
      await ensureDoc("sizes", { name: { equals: item.name } }, item);
      results.sizes += 1;
    }
    for (const item of seedMaterials) {
      await ensureDoc("materials", { name: { equals: item.name } }, item);
      results.materials += 1;
    }
    for (const item of seedFrameColors) {
      await ensureDoc("frame-colors", { name: { equals: item.name } }, item);
      results["frame-colors"] += 1;
    }
    for (const item of seedHangOptions) {
      await ensureDoc("hang-options", { name: { equals: item.name } }, item);
      results["hang-options"] += 1;
    }

    return NextResponse.json({ ok: true, results }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
