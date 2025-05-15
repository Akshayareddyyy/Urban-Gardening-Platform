/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
import next from "next";
import path from "path";

// Ensure that relative paths are calculated from the Next.js project root
// process.cwd() will be './functions' in the GCF environment, so we go up one level.
const projectRoot = path.join(__dirname, "..", "..");

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  conf: { distDir: ".next" }, // Specifies the Next.js build output directory
  dir: projectRoot, // Specifies the Next.js project directory
});
const handle = app.getRequestHandler();

export const nextServer = functions.https.onRequest(async (req, res) => {
  // Log to confirm the function is being invoked
  console.log(`[nextServer] Function invoked. Request URL: ${req.url}. Request method: ${req.method}`);
  console.log("[nextServer] Ensure NEXT_PUBLIC_PERENUAL_API_KEY is set in the function's runtime environment variables.");

  try {
    await app.prepare();
    return handle(req, res);
  } catch (error) {
    console.error("[nextServer] Error preparing or handling request:", error);
    res.status(500).send("Internal Server Error preparing Next.js app");
    return; // Explicitly return to avoid further processing
  }
});
