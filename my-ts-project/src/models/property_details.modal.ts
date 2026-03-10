import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../config/database";

// Define attributes interface
class PropertyDetails extends Model {
  property_id?: number;
  property_status_id?: number;
  property_type_id?: number;
  property_available_status_id?: number;
  property_title?: string;
  property_description?: string;
  property_area?: number;
  property_price?: number;
  contact_number?: number;
  file_upload_ids?: string[];
  property_location_id?: number;
  negotiable?: boolean;
  youtube_link?: string;
  instagram_link?: string;
  seo_title?: string;
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Initialize the model
PropertyDetails.init(
  {
    property_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    property_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    property_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    property_available_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    property_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    property_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    property_area: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    negotiable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    property_price: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    contact_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    file_upload_ids: {
      type:  DataTypes.ARRAY(DataTypes.INTEGER),  // ✅ MUST pass inner type
      allowNull: true,
    },
    property_location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    youtube_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instagram_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seo_title: {
      type: DataTypes.STRING,
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

export default PropertyDetails;