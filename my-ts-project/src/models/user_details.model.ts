import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare is_admin: boolean
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
  },
  {
    sequelize,
    tableName: "user_details",
    timestamps: false
  }
);

export default User;
