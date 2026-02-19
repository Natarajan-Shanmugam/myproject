import { DataTypes, Model } from "sequelize";
import {sequelize} from "../config/database";

class PropertyType extends Model {
  declare property_type_id: number;
  declare property_type_name: string;
}

PropertyType.init(
  {
    property_type_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    property_type_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "property_type",
    timestamps: false
  }
);

export default PropertyType;
