import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../config/database";

// Define attributes interface
interface PropertyAttributes {
  property_location_id?: number;
  property_id?: number;
  city?: string;
  area?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  google_map_url?: string;
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Define model class
export class PropertyLocations extends Model<PropertyAttributes> implements PropertyAttributes {
  public property_location_id!: number;
  public property_id!: number;
  public city!: string;
  public area!: string;
  public landmark!: string;
  public latitude!: number;
  public longitude!: number;
  public google_map_url?: string;
  public created_by!: number;
  public updated_by!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

// Initialize the model
PropertyLocations.init(
  {
    property_location_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    landmark: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    google_map_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "property_locations",
    timestamps: true,        // Enable Sequelize timestamps
    createdAt: "created_at", // Map createdAt
    updatedAt: "updated_at", // Map updatedAt
  }
);