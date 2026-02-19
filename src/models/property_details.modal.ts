import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../config/database";

// Define attributes interface
interface PropertyAttributes {
  property_id?: number;
  property_status?: string;
  property_type_id?: number;
  property_listing_type?: string;
  property_title?: string;
  property_price?: number;
  contact_number?: number;
  file_id?: string;
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Define model class
export class Property extends Model<PropertyAttributes> implements PropertyAttributes {
  public property_id!: number;
  public property_status!: string;
  public property_type_id!: number;
  public property_listing_type!: string;
  public property_title!: string;
  public property_price!: number;
  public contact_number!: number;
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
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    property_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    property_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    property_listing_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
        property_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    property_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
     contact_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
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
    tableName: "property_details",
    timestamps: true,        // Enable Sequelize timestamps
    createdAt: "created_at", // Map createdAt
    updatedAt: "updated_at", // Map updatedAt
  }
);