
module.exports = server => {
	
	server.on("listening", none => {
		console.log(`Listening on ${getBind(server.address())}.`);
	});
	
	server.on("error", err => {
		if (err.syscall !== "listen") throw err;
		
		var bind = getBind(server.address());
		
		// handle specific listen errors with friendly messages
		switch (err.code) {
			case "EACCES":
				console.error(bind + " requires elevated privileges");
				process.exit(1);
				break;
			case "EADDRINUSE":
				console.error(bind + " is already in use");
				process.exit(1);
				break;
			default:
				throw err;
		}
	});
	
};

function getBind(addr) {
	return typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
}