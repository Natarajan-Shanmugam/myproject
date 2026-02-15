import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../config/database";
import  User from "./user.model"; // Import User model for association

// Define attributes interface
interface PropertyAttributes {
  property_id: number;
  property_type: string;
  property_name: string;
  property_city: string;
  property_price: number;
  file_id?: string;
  created_by: number;
  updated_by: number;
  created_at?: Date;
  updated_at?: Date;
}

// Optional attributes for creation
interface PropertyCreationAttributes extends Optional<PropertyAttributes, "property_id" | "created_at" | "updated_at" | "file_id"> {}

// Define model class
export class Property extends Model<PropertyAttributes, PropertyCreationAttributes> implements PropertyAttributes {
  public property_id!: number;
  public property_type!: string;
  public property_name!: string;
  public property_city!: string;
  public property_price!: number;
  public file_id?: string;
  public created_by!: number;
  public updated_by!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

// Initialize the model
Property.init(
  {
    property_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    property_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    property_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    property_city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    property_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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
    tableName: "properties",
    timestamps: true,        // Enable Sequelize timestamps
    createdAt: "created_at", // Map createdAt
    updatedAt: "updated_at", // Map updatedAt
  }
);