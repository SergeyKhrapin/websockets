async function createResponse(path, mimeType) {
	const file = await Deno.open(path, { read: true });
	const response = new Response(file.readable);
	response.headers.set("Content-Type", mimeType);
	return response;
}

Deno.serve({
	port: 80,
	async handler(request) {
		if (request.headers.get("upgrade") !== "websocket") {
			const url = new URL(request.url);
			// If the request is a normal HTTP request,
			// we serve the client HTML, CSS, or JS.
			switch (url.pathname) {
				case "/client.js":
					return await createResponse("./client.js", "text/javascript");
				case "/client.css":
					return await createResponse("./client.css", "text/css");
				case "/":
					return await createResponse("./index.html", "text/html");
				default:
					return new Response("Not found", {
						status: 404,
					});
			}
		}
		// If the request is a websocket upgrade,
		// we need to use the Deno.upgradeWebSocket helper
		const { socket, response } = Deno.upgradeWebSocket(request);
		let intervalId;

		socket.onopen = () => {
			console.log("CONNECTED");
			intervalId = setInterval(() => {
				socket.send("new notification");
			}, 2000);
		};
		socket.onmessage = (event) => {
			console.log(`RECEIVED: ${event.data}`);
			socket.send("pong");
		};
		socket.onclose = () => {
			console.log("DISCONNECTED");
			clearInterval(intervalId);
		};
		socket.onerror = (error) => console.error("ERROR:", error);

		return response;
	},
});
