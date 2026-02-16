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
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "POST, OPTIONS",
					"Access-Control-Allow-Headers": "*"
				}
			});
		}
		if (request.method === "POST") {
			await request.arrayBuffer();
			return new Response("OK", {
				headers: { "Access-Control-Allow-Origin": "*" }
			});
		}
		return new Response("Method Not Allowed", { status: 405, headers: { "Access-Control-Allow-Origin": "*" } });
	},
} satisfies ExportedHandler<Env>;
