const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

const nextApp = require("next")({ dev });
const nextHandler = nextApp.getRequestHandler();

(async () => {
	await nextApp.prepare();

	const app = require("express")();
	app.use(require("body-parser").json());

	var http = require("http").createServer(app);

	const io = require("socket.io")(http);
	app.io = io;

	io.on("connection", (socket) => {
		console.log("a user connected");
	});

	const Spyfall = require("./server/spyfall");
	app.spyfall = new Spyfall(dev);

	require("./routes")(app);

	const nextI18next = require("./i18n");
	await nextI18next.initPromise;

	const nextI18NextMiddleware = require("next-i18next/middleware").default;
	app.use(nextI18NextMiddleware(nextI18next));

	app.get("*", (req, res) => nextHandler(req, res));

	await http.listen(port);
	console.log(`> Ready on http://localhost:${port}`); // eslint-disable-line no-console
})();
