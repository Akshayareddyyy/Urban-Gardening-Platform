// functions/src/index.ts
import * as functions from 'firebase-functions';
import next from 'next';

// Determine if running in development or production
const dev = process.env.NODE_ENV !== 'production';

// Initialize the Next.js app.
// The 'dir' option points to the root of your Next.js project relative to the 'functions' directory.
// When deployed, the 'functions' directory is at the root, so '../' points to the Next.js app root.
const app = next({
  dev, // This will be false in deployed Firebase Functions
  conf: { distDir: '.next' }, // Specifies the .next directory relative to the Next.js project root
  dir: '../', // Points to the root of your Next.js application
});

const handle = app.getRequestHandler();

export const nextServer = functions
  .region('us-central1') // You can change this to your preferred region
  .runWith({ memory: '1GB' }) // Recommended memory for Next.js, can be '512MB', '1GB', '2GB'
  .https.onRequest(async (request, response) => {
    // Log the original URL for debugging (optional)
    console.log(`[nextServer] Request for: ${request.originalUrl}`);
    // Ensure Next.js is prepared before handling requests
    await app.prepare();
    return handle(request, response);
  });
