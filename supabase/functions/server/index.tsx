import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

/* ── Supabase client (service role for storage management) ── */
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const AUDIO_BUCKET = "make-ff48df62-audio";

/* ── Ensure bucket exists (called lazily, cached) ── */
let _bucketReady = false;

async function ensureBucket(): Promise<string | null> {
  if (_bucketReady) return null;
  try {
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
    if (listErr) {
      console.log(`[audio] listBuckets error: ${listErr.message}`);
      return listErr.message;
    }
    const exists = buckets?.some((b: any) => b.name === AUDIO_BUCKET);
    if (!exists) {
      const { error: createErr } = await supabase.storage.createBucket(AUDIO_BUCKET, {
        public: false,
      });
      if (createErr) {
        console.log(`[audio] createBucket error: ${createErr.message}`);
        return createErr.message;
      }
      console.log(`[audio] Bucket "${AUDIO_BUCKET}" created successfully`);
    } else {
      console.log(`[audio] Bucket "${AUDIO_BUCKET}" already exists`);
    }
    _bucketReady = true;
    return null;
  } catch (e) {
    console.log(`[audio] ensureBucket exception: ${e}`);
    return String(e);
  }
}

// Health check endpoint
app.get("/make-server-ff48df62/health", (c) => {
  return c.json({ status: "ok" });
});

/* ── Force-init: creates bucket and returns status ── */
app.get("/make-server-ff48df62/init", async (c) => {
  _bucketReady = false; // force re-check
  const err = await ensureBucket();
  if (err) {
    return c.json({ status: "error", error: err, bucket: AUDIO_BUCKET }, 500);
  }

  // Also list what's in the bucket
  const { data: files, error: listErr } = await supabase.storage
    .from(AUDIO_BUCKET)
    .list("", { limit: 100 });

  return c.json({
    status: "ok",
    bucket: AUDIO_BUCKET,
    files: listErr ? [] : (files || []).map((f: any) => f.name),
    message: `Bucket "${AUDIO_BUCKET}" is ready. Upload .ogg files here via Supabase Dashboard → Storage → ${AUDIO_BUCKET}`,
  });
});

/* ── List audio files in bucket ── */
app.get("/make-server-ff48df62/audio", async (c) => {
  const bucketErr = await ensureBucket();
  if (bucketErr) {
    return c.json({ error: `Bucket init failed: ${bucketErr}` }, 500);
  }
  try {
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .list("", { limit: 100 });
    if (error) {
      console.log(`[audio] List error: ${error.message}`);
      return c.json({ error: `Failed to list audio files: ${error.message}` }, 500);
    }
    const files = (data || [])
      .filter((f: any) => f.name && !f.name.startsWith("."))
      .map((f: any) => ({ name: f.name, size: f.metadata?.size }));
    return c.json({ files });
  } catch (e) {
    console.log(`[audio] List exception: ${e}`);
    return c.json({ error: `List exception: ${e}` }, 500);
  }
});

/* ── Get signed URL for a specific audio file ── */
app.get("/make-server-ff48df62/audio/:filename", async (c) => {
  const bucketErr = await ensureBucket();
  if (bucketErr) {
    return c.json({ error: `Bucket init failed: ${bucketErr}` }, 500);
  }
  const filename = c.req.param("filename");
  try {
    const { data, error } = await supabase.storage
      .from(AUDIO_BUCKET)
      .createSignedUrl(filename, 3600);
    if (error) {
      console.log(`[audio] Signed URL error for "${filename}": ${error.message}`);
      return c.json({ error: `Failed to get signed URL: ${error.message}` }, 500);
    }
    return c.json({ url: data.signedUrl, filename });
  } catch (e) {
    console.log(`[audio] Signed URL exception for "${filename}": ${e}`);
    return c.json({ error: `Signed URL exception: ${e}` }, 500);
  }
});

Deno.serve(app.fetch);
