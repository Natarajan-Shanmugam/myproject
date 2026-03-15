// models/FileUpload.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

class FileUpload extends Model {
  public file_upload_id!: number;
  public file_name!: string;
  public file_key!: string;
  public file_url!: string;
  public file_size!: number;
  public mime_type!: string;
  is_email_attachement!: boolean;
}

FileUpload.init(
  {
    file_upload_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    file_name: DataTypes.STRING,
    file_key: DataTypes.STRING,
    file_url: DataTypes.TEXT,
    file_size: DataTypes.BIGINT,
    mime_type: DataTypes.STRING,
    is_email_attachement: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    tableName: "file_uploads",
    timestamps: false,
  }
);

export default FileUpload;