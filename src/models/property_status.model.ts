import { DataTypes, Model } from "sequelize";
import {sequelize} from "../config/database";

class PropertyStatus extends Model {
  declare property_status_id: number;
  declare property_status_name: string;
}

PropertyStatus.init(
  {
    property_status_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    property_status_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "property_status",
    timestamps: false
  }
);

export default PropertyStatus;
