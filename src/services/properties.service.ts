import dotenv from "dotenv";
dotenv.config();

import PropertyDetails from "../models/property_details.modal";
import { PropertyLocations } from "../models/property_locations.modal";
import PropertyType from "../models/property_type.model";
import PropertyStatus from "../models/property_status.model";
import PropertyAvailStatus from "../models/property_available_status.model";
import { sequelize } from "../config/database";
import { QueryTypes, Op } from "sequelize";
import { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, bulkDeleteFromS3 } from "../config/s3Config";
import { v4 as uuidv4 } from "uuid";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import FileUpload from "../models/file_uploads";
import User from "../models/user_details.model";
import { EmailService } from "../services/email.service";


interface PropertyData {
    property_id?: number;
    property_location_id?: number;
    property_type: string;
    property_name: string;
    property_city: string;
    property_price: number;
    city: string,
    area: string,
    landmark: string,
    seo_title: string,
    created_by?: number;
    updated_by?: number;
}

export class PropertiesService {
    static parseFileUploadIds(value: any): number[] {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
            return value.replace(/[{}]/g, '').split(',').filter(Boolean).map(Number);
        }
        return [];
    }

    static formatFileUploadIds(ids: number[]): string {
        return `{${ids.join(',')}}`;
    }

    static async AddProperties(data: PropertyData) {
        console.log('@Service PropertiesService @Method AddProperties  @data: ', data);

        const { property_id, property_location_id, city, area, landmark, ...propertyFields } = data;
        const property_location = { city, area, landmark }
        try {

            propertyFields.seo_title = propertyFields.seo_title.toLowerCase().trim().replace(/\s+/g, "-");
            if (property_id && property_location_id) {
                // Update existing property
                await PropertyDetails.update(propertyFields, { where: { property_id } });
                const property_details_update_response = await PropertyDetails.findByPk(property_id, { raw: true });
                await PropertyLocations.update(property_location, { where: { property_location_id } });
                console.log('@Service PropertiesService @Method AddProperties @Message: Property details updated!')
                return { staus: true, message: "Property details updated!", data: property_details_update_response };
            } else {
                // Create new property
                let property_locations_res = await PropertyLocations.create({
                    city,
                    area,
                    landmark
                });

                const property_details_create_response = await PropertyDetails.create({ ...propertyFields, property_location_id: property_locations_res.property_location_id });
                console.log('@Service PropertiesService @Method AddProperties @Message: Property details created!')
                return { staus: true, message: "Property details created!", data: property_details_create_response };
            }
        } catch (error) {
            console.error('@Service PropertiesService @Error: ', error);
            return { staus: false, message: error }
        }
    }

    static async ListProperties(user_id: number, listPublic: boolean) {
        console.log('@Service PropertiesService @Method ListProperties user_id: ', user_id, 'listPublic: ', listPublic);

        try {

            let user_filter = ``, column_filter = ``;
            const user_res = await User.findOne({ where: { is_admin: true }, raw: true }); //if public api get admin entered details only
            if (listPublic) {
                if (!user_res) {
                    return { staus: true, message: "Property list not found!" };
                }
                user_filter = `where pd.created_by = ${user_res?.id}`;
            } else if (user_id) {
                user_filter = `where pd.created_by = ${user_id}`
                column_filter = `pd.contact_number,`
            }

            const property_lists = this.parsePropertyListJsonFields(await sequelize.query(await this.PropertyListQuery(user_filter, column_filter), { type: QueryTypes.SELECT }));
            console.log('@Service PropertiesService @Method ListProperties @Message:Property list loaded! Total: ' + property_lists.length)
            return { staus: true, message: "Property list loaded! Total: " + property_lists.length, data: property_lists };
        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async RemoveProperties(property_id: number) {
        console.log('@Service PropertiesService @method RemoveProperties @data::property_id ', property_id);

        try {

            const find_file_upload_ids = await PropertyDetails.findByPk(property_id, {
                raw: true,
            });

            const fileUploadIds = this.parseFileUploadIds(find_file_upload_ids?.file_upload_ids);

            if (fileUploadIds.length) {

                // Step 2: fetch file_key from FileUpload table
                const files = await FileUpload.findAll({
                    where: {
                        file_upload_id: {
                            [Op.in]: fileUploadIds,
                        },
                    },
                    attributes: ["file_key"],
                    raw: true,
                });

                //form file_key array
                const file_list_for_remove = files.map(file => file.file_key);

                //bulk delete from S3
                if (file_list_for_remove.length) {
                    await bulkDeleteFromS3(file_list_for_remove);
                }

                await FileUpload.destroy({ where: { file_upload_id: { [Op.in]: fileUploadIds, }, } });

                // Step 5: optional → clear property reference
                // await PropertyDetails.update({ file_upload_ids: [] }, { where: { property_id } });

                console.log('Property images are removed: ', file_list_for_remove);

            }

            await PropertyDetails.destroy({ where: { property_id: property_id, } });
            await PropertyLocations.destroy({ where: { property_location_id: find_file_upload_ids?.property_location_id, } });
            return { staus: true, message: "Removed property details!" };
        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async SeedData() {
        console.log('@Service PropertiesService @method RemoveProperties ');

        try {

            return {
                staus: true,
                message: "Seed data loaded!",
                data: {
                    property_type: await PropertyType.findAll(),
                    property_status: await PropertyStatus.findAll(),
                    property_available_status: await PropertyAvailStatus.findAll(),

                }
            };

        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async UploadFile(input: any, files: any) {
        console.log('@Service PropertiesService @method UploadFile file: ');
        console.log('@Service PropertiesService @method UploadFile input', input);
        console.log('process.env.AWS_REGION: ', process.env.AWS_REGION)
        try {

            const property = await PropertyDetails.findOne({
                where: { property_id: Number(input.property_id) }
            });

            if (!property) {
                return { message: "No property details found!" }
            }

            const existingIds = this.parseFileUploadIds(property?.file_upload_ids);

            const multi_files = files as Express.Multer.File[];

            if (!multi_files || multi_files.length === 0) {
                return { message: "No file uploaded" };
            }

            const uploadedFiles = [];
            const uploadedIds = [];

            for (const file of multi_files) {
                const fileKey = `properties/${uuidv4()}-${file.originalname}`;

                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileKey,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                });

                await s3.send(command);

                const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

                // Save in DB
                const savedFile = await FileUpload.create({
                    file_name: file.originalname,
                    file_key: fileKey,
                    file_url: fileUrl,
                    file_size: file.size,
                    mime_type: file.mimetype,
                });

                uploadedFiles.push(savedFile);
                uploadedIds.push(savedFile.file_upload_id);

                //update file to property
                await PropertyDetails.update(
                    { file_upload_ids: this.formatFileUploadIds([...existingIds, ...uploadedIds]) },
                    { where: { property_id: Number(input.property_id) } }
                );

            }
            console.log('@Service PropertiesService @Method UploadFile @Message: File uploaded successfully');
            return {
                message: "File uploaded successfully",
                count: uploadedFiles.length,
                data: uploadedFiles,
            };

        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error);
            return error
        }
    }

    static async RemoveImage(property_id: number, file_upload_id: number) {
        console.log('@Service PropertiesService @method RemoveProperties ');

        try {

            const file_upload_res = await FileUpload.findByPk(file_upload_id, { raw: true });
            const file_remove_res = await FileUpload.destroy({ where: { file_upload_id: file_upload_id } });

            if (file_remove_res) {
                const property = await PropertyDetails.findByPk(Number(property_id), { raw: true });
                const remainingIds = this.parseFileUploadIds(property?.file_upload_ids).filter(id => id !== file_upload_id);

                await PropertyDetails.update({
                    file_upload_ids: this.formatFileUploadIds(remainingIds)
                },
                    { where: { property_id: Number(property_id) } });

                console.log('file_remove_res: ', file_remove_res)

                //remove s3 file
                await bulkDeleteFromS3([`${file_upload_res?.file_key}`]);


                return { message: "Image removed successfully" };
            }
            return { message: "Image not removed" };
        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async SentContactUsEmail(input: any, files: any) {
        console.log('@Service PropertiesService @method SentEmail ');

        try {

            const is_files_exists = files as Express.Multer.File[];

            if (is_files_exists) {
                let attach_res: any = await this.UploadAttachementFile(input, files)
                input.attachement_files = attach_res?.data
            }

            let email = await EmailService.sendEmail(input);

            return email;

        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async UploadAttachementFile(input: any, files: any) {
        console.log('@Service PropertiesService @method UploadFile file: ');
        console.log('@Service PropertiesService @method UploadFile input', input);
        console.log('process.env.AWS_REGION: ', process.env.AWS_REGION)
        try {

            const multi_files = files as Express.Multer.File[];

            if (!multi_files || multi_files.length === 0) {
                return { message: "No file uploaded" };
            }

            const uploadedFiles = [];
            const uploadedIds = [];

            for (const file of multi_files) {
                const fileKey = `attachements/${uuidv4()}-${file.originalname}`;

                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileKey,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ContentDisposition: `attachment; filename="${file.originalname}"`,
                });

                await s3.send(command);

                const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

                // Save in DB
                const savedFile = await FileUpload.create({
                    file_name: file.originalname,
                    file_key: fileKey,
                    file_url: fileUrl,
                    file_size: file.size,
                    mime_type: file.mimetype,
                    is_email_attachement: true
                });

                uploadedFiles.push({
                    file_name: file.originalname,
                    file_url: fileUrl,
                });
                uploadedIds.push(savedFile.file_upload_id);

            }
            console.log('@Service PropertiesService @Method UploadFile @Message: File uploaded successfully');
            return {
                message: "File uploaded successfully",
                count: uploadedFiles.length,
                data: uploadedFiles,
            };

        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error);
            return error
        }
    }

    static async ListDetailsPublic(property_id: number, user_id: number) {
        console.log('@Service PropertiesService @Method ListDetailsPublic property_id: ', property_id, 'user_id ', user_id);
        try {

            let user_filter = ``, column_filter = ``;
            const user_res: any = await User.findOne({ where: { is_admin: true }, raw: true }); //if public api get admin entered details only

            if (user_id) {
                user_res.id = user_id
            }
            else if (!user_res) {
                return { staus: true, message: "Property list not found!" };
            }

            user_filter = `where pd.created_by = ${user_res?.id} and pd.property_id = ${property_id}`;
            const property_lists = this.parsePropertyListJsonFields(await sequelize.query(await this.PropertyListQuery(user_filter, column_filter), { type: QueryTypes.SELECT }));
            console.log('@Service PropertiesService @Method ListDetailsPublic @Message:Property list loaded! Total: ' + property_lists.length)

            if (property_lists.length) {
                return { staus: true, message: "Property details list loaded! Total: " + property_lists.length, data: property_lists };
            }
            return { staus: false, message: "Property details list not found!" };

        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async propertyLocationsDropdown() {
        console.log('@Service PropertiesService @Method propertyLocationsDropdown');
        try {

            const property_loc_drp_down = await sequelize.query(await this.PropertyLocationDropDownDetails(), { type: QueryTypes.SELECT });
            console.log('@Service PropertiesService @Method propertyLocationsDropdown @Message:Property list loaded! Total: ' + property_loc_drp_down.length)

            if (property_loc_drp_down.length) {
                return { staus: true, message: "Property locations list loaded! Total: " + property_loc_drp_down.length, data: property_loc_drp_down };
            }
            return { staus: false, message: "Property locations list not found!" };

        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async propertyStatusDropdown() {
        console.log('@Service PropertiesService @method propertyStatusDropdown ');

        try {

            return {
                staus: true,
                message: "Seed data loaded!",
                data: {
                    property_status: await PropertyStatus.findAll(),

                }
            };

        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async propertyFilter(input: any) {
        console.log('@Service PropertiesService @Method propertyFilter input: ', input);
        try {

            let user_filter = ``, column_filter = ``;
            const user_res: any = await User.findOne({ where: { is_admin: true }, raw: true }); //if public api get admin entered details only

            if (input.user_id) {
                user_res.id = input.user_id
            } else if (!user_res) {
                return { staus: true, message: "Property list not found!" };
            }

            user_filter = `where pd.created_by = ${user_res?.id} `;
            if (input.city && input.city.toLowerCase() !== 'all') {
                user_filter += ` AND pl.city ILIKE '%${input.city}%'`;
            }

            //Property status filter: Sale/Rent
            if (input.property_status && input.property_status.toLowerCase() !== 'all') {
                user_filter += ` AND ps.property_status_name ILIKE '%${input.property_status}%'`;
            }

            //Property status filter: Plot, Villa etc
            if (input.property_type && input.property_type.toLowerCase() !== 'all') {
                user_filter += ` AND pt.property_type_name ILIKE '%${input.property_type}%'`;
            }

            if (input.property_title && input.property_title.toLowerCase() !== 'all') {
                user_filter += ` AND pd.property_title ILIKE '%${input.property_title}%'`;
            }

            const property_lists = this.parsePropertyListJsonFields(await sequelize.query(await this.PropertyListQuery(user_filter, column_filter), { type: QueryTypes.SELECT }));
            console.log('@Service PropertiesService @Method propertyFilter @Message:Property list loaded! Total: ' + property_lists.length)

            if (property_lists.length) {
                return { staus: true, message: "Filtered Property list loaded! Total: " + property_lists.length, data: property_lists };
            }
            return { staus: false, message: "Filtered Property list not found!" };

        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async GetSignedURL(file_key: string) {
        console.log('@Service PropertiesService @method RemoveProperties ');

        try {

            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: file_key,
            });

            const url = await getSignedUrl(s3, command, {
                expiresIn: 3600, // 1 hour
            });

            return url;

        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static parsePropertyListJsonFields(property_lists: any[]) {
        return property_lists.map((property: any) => ({
            ...property,
            file_upload_details: typeof property.file_upload_details === 'string'
                ? JSON.parse(property.file_upload_details)
                : property.file_upload_details,
        }));
    }

    static async PropertyListQuery(user_filter: string, column_filter: string) {
        const query = ` 
        SELECT 
            pd.property_id,
            pl.property_location_id,
            pt.property_type_name,
            ps.property_status_name,
            pas.property_available_status_name,
            pd.property_type_id,
            pd.property_status_id,
            pd.property_available_status_id,
            pd.property_title,
            pd.property_description,
            pd.property_area,
            pd.negotiable,
            pd.youtube_link,
            pd.instagram_link,
            pd.property_price,
            ${column_filter}
            pl.city,
            pl.area,
            pl.landmark,
            pd.seo_title,
            (
                SELECT COALESCE(
                    json_group_array(
                        json_object(
                            'file_upload_id', fu.file_upload_id,
                            'file_name', fu.file_name,
                            'file_url', fu.file_url
                        )
                    ),
                    '[]'
                )
                FROM file_uploads fu
                WHERE fu.file_upload_id IN (
                    SELECT value
                    FROM json_each(
                        CASE
                            WHEN json_valid(
                                '[' ||
                                REPLACE(
                                    REPLACE(pd.file_upload_ids, '{', ''),
                                    '}', ''
                                )
                                || ']'
                            )
                            THEN
                                '[' ||
                                REPLACE(
                                    REPLACE(pd.file_upload_ids, '{', ''),
                                    '}', ''
                                )
                                || ']'
                            ELSE '[]'
                        END
                    )
                )
            ) AS file_upload_details
            
        FROM property_details pd
                JOIN property_type pt ON (pd.property_type_id = pt.property_type_id)
                JOIN property_status ps ON (pd.property_status_id = ps.property_status_id)
                JOIN property_available_status pas ON (pd.property_available_status_id = pas.property_available_status_id)
                JOIN property_locations pl ON (pd.property_location_id = pl.property_location_id)
                ${user_filter}`
        return query;
    }

    static async PropertyLocationDropDownDetails() {
        return `
            SELECT
                property_location_id,
                city,
                area,
                landmark
            FROM (
                SELECT
                    pl.property_location_id,
                    pl.city,
                    pl.area,
                    pl.landmark,
                    ROW_NUMBER() OVER (
                        PARTITION BY pl.city
                        ORDER BY pl.property_location_id
                    ) AS row_num
                FROM property_details pd
                JOIN property_locations pl
                    ON pd.property_location_id = pl.property_location_id
                JOIN user_details ud
                    ON pd.created_by = ud.id
                WHERE ud.is_admin IS TRUE
            )
            WHERE row_num = 1
            ORDER BY city, property_location_id;`
    }

}