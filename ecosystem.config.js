module.exports = {
	apps: [
		{
			name: "myapp",
			script: "dist/app.js",
			instances: 1,
			exec_mode: "fork",
			autorestart: true,
			watch: false,
			max_memory_restart: "300M",
			env: {
				NODE_ENV: process.env.TRUSTYPLOTS_ENV,
				DB_HOST: process.env.TRUSTYPLOTS_DB_HOST,
				DB_USER: process.env.TRUSTYPLOTS_DB_USER,
				DB_PASSWORD: process.env.TRUSTYPLOTS_DB_PASSWORD,
				DB_NAME: process.env.TRUSTYPLOTS_DB_NAME,
				DB_PORT: process.env.TRUSTYPLOTS_DB_PORT
			}
		}
	]
};
