
# Internet Speedtest Tool

This is a browser-based internet speed test application. It measures your download speed, upload speed, ping, jitter, and latency using a large file and a simple upload endpoint.

## Features
- Accurate download speed measurement using a large file (e.g., 100MB.zip)
- Upload speed test using a Cloudflare Worker or similar endpoint
- Ping, jitter, and latency measurement
- Progress bar and user-friendly error messages
- Automatic retries for failed network requests

## Setup
1. Place a large file (e.g., `100MB.zip`) in your web server root or a public file host. Update the download URL in the code if needed.
2. Deploy the upload worker in `upload-test/` (see its README for instructions). Use the deployed URL in the frontend.
3. Open `index.html` in your browser to use the speedtest tool.

## Usage
- Click the **START** button to begin the test.
- The app will run several rounds of each test and show the average result.
- Progress and errors are shown in the UI.

## Required Server Endpoints

### Download Endpoint
- The download test expects a large file (e.g., `100MB.zip`) to be accessible at a public URL.
- The file should support HTTP range requests and CORS headers for best results.

### Upload Endpoint
- The upload test expects a POST endpoint that accepts large file uploads (e.g., 20MB+ per request).
- The included Cloudflare Worker in `upload-test/` provides a simple upload endpoint that responds with `200 OK` and CORS headers.

#### Example Worker Endpoint
See `upload-test/src/index.ts` for a minimal CORS-enabled upload handler.

## Troubleshooting
- If you see errors, check that the download and upload URLs are correct and accessible from your browser.
- Make sure CORS headers are set on both endpoints.
- For accurate results, use a large file and a fast, reliable server.

## Automated Testing
Automated tests for the core speedtest functions can be added using a framework like Jest or Mocha. See the `test/` directory (to be created) for examples.