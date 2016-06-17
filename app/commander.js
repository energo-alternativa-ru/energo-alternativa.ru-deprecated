
"use strict";


let pkg = require("load-pkg").sync();
let program = require("commander");

program
	.version(pkg.version)
	.usage("[options]")
	.option("-c, --config [file]", "Путь к конфигурационному файлу (file=path|temp).")
	.parse(process.argv);

if (!program.config) program.help();

module.exports = program;