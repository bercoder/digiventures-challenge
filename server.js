const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");

const mongoose = require("./services/connection");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

//Configuration requires
const ConfigurationModel = require("./models/PageModel");
const ConfigurationService = require("./services/ConfigurationService");
const ConfigurationController = require("./controllers/ConfigurationController");

//Configuration instances
const ConfigurationServiceInstance = new ConfigurationService(
	ConfigurationModel
);

const ConfigurationControllerInstance = new ConfigurationController(
	ConfigurationServiceInstance
);

app.prepare().then(() => {
	const server = express();

	server.use(bodyParser.urlencoded({ extended: false }));
	server.use(bodyParser.json());

	//get configuration by path
	server.get("/configuration/:path", (req, res) => {
		if (!mongoose.connection?.readyState) {
			res.status(500).json({
				error: "DB is not connected",
			});
		}

		return ConfigurationControllerInstance.get(req, res);
	});

	server.get("/configuration", (req, res) => {
		if (!mongoose.connection?.readyState) {
			res.status(500).json({
				error: "DB is not connected",
			});
		}
		return ConfigurationControllerInstance.index(req, res);
	});

	server.post("/:path", (req, res) => {
		console.log(req.params.path, ':', req.body);
	
		return res.json({
			message: 'received',
			data: req.body
		});
	});

	server.all("*", (req, res) => {
		return handle(req, res);
	});

	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});
