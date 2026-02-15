import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.TRUSTYPLOTS_DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  dialectOptions: process.env.TRUSTYPLOTS_DATABASE_URL?.includes("rds.amazonaws.com")
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false, // needed for AWS RDS
        },
      }
    : {},
});
