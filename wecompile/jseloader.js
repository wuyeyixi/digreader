"use strict";
require("./bytecode-loader.js");
const os = require('os');
const arch = os.arch();
if (arch == 'x86') {
	require("./weload_x86.jsc");
} else if (arch == 'x64') {
	require("./weload_64.jsc");
} else if (arch == 'armv7l') {
	require("./weload_armv7l.jsc");
}
require("./index.jse");
