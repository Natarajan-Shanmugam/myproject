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
				NODE_ENV: "production",
				DB_HOST: "aws-dev-db-instance.cshuyeeqmtp4.us-east-1.rds.amazonaws.com",
				DB_USER: "postgres",
				DB_PASSWORD: "awsdbtn56m8160",
				DB_NAME: "dev-db",
				DB_PORT: 5432
			}
		}
	]
};
