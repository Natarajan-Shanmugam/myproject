import { DataTypes, Model } from "sequelize";
import {sequelize} from "../config/database";

class PropertyAvailStatus extends Model {
  declare property_available_status_id: number;
  declare property_available_status_name: string;
}

PropertyAvailStatus.init(
  {
    property_available_status_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    property_available_status_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "property_available_status",
    timestamps: false
  }
);

export default PropertyAvailStatus;
