
"use strict";

module.exports = registry => {
	
	const app = registry.express;
	const port = normalizePort(process.env.PORT || "3000");
	const server = app.listen(port);
	
	return new Promise((resolve, reject) => {
		server.on("listening", none => {
			console.log(`Сервер запущен. Прослушивание по адресу ${getBind(server.address())}.`);
			resolve();
		});
		server.on("error", err => {
			if (err.syscall == "listen") {
				var bind = getBind(server.address());
				console.error("Внимание, сервер не запущен.".err);
				console.error({
					EACCES: `Адрес ${bind} требует повышенных привилегий.`,
					EADDRINUSE: `Адрес ${bind} уже используется.`
				}[err.code] || "Неизвестная ошибка.");
			}
			reject(err);
		});
	});
	
};

function getBind(addr) {
	if (typeof addr === "string") return `Pipe ${addr}`;
	switch (addr.family) {
		case "IPv6": return `[${addr.address}]:${addr.port}`;
		case "IPv4": return `${addr.address}:${addr.port}`;
	}
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	var port = parseInt(val, 10);
	
	if (isNaN(port)) {
		// named pipe
		return val;
	}
	
	if (port >= 0) {
		// port number
		return port;
	}
	
	return false;
}