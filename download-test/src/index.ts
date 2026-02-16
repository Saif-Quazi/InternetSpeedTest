/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export default {
	async fetch(request, env, ctx): Promise<Response> {
		const size = 1 * 1024 * 1024;
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
					"Access-Control-Allow-Headers": "*"
				}
			});
		}
		if (request.method === "HEAD") {
			return new Response(null, {
				headers: {
					"Content-Type": "application/octet-stream",
					"Content-Length": size.toString(),
					"Access-Control-Allow-Origin": "*",
					"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
					"Pragma": "no-cache",
					"Expires": "0"
				}
			});
		}
		   if (request.method === "GET") {
			   const data = new Uint8Array(size);
			   for (let i = 0; i < size; i += 65536) {
				   const chunk = data.subarray(i, Math.min(i + 65536, size));
				   crypto.getRandomValues(chunk);
			   }
			   return new Response(data, {
				   headers: {
					   "Content-Type": "application/octet-stream",
					   "Content-Length": size.toString(),
					   "Access-Control-Allow-Origin": "*",
					   "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
					   "Pragma": "no-cache",
					   "Expires": "0"
				   }
			   });
		}
		return new Response("Method Not Allowed", { status: 405, headers: { "Access-Control-Allow-Origin": "*" } });
	},
} satisfies ExportedHandler<Env>;
