import PropertyDetails from "../models/property_details.modal";
import { PropertyLocations } from "../models/property_locations.modal";
import PropertyType from "../models/property_type.model";
import PropertyStatus from "../models/property_status.model";
import PropertyAvailStatus from "../models/property_available_status.model";
import { sequelize } from "../config/database";
import { QueryTypes } from "sequelize";

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
    created_by?: number;
    updated_by?: number;
}

export class PropertiesService {
    static async AddProperties(data: PropertyData) {
        console.log('@Service PropertiesService @Method AddProperties  @data: ', data);

        const { property_id, property_location_id, city, area, landmark, ...propertyFields } = data;
        const property_location = {
            city,
            area,
            landmark
        }

        try {
            if (property_id && property_location_id) {
                // Update existing property
                await PropertyDetails.update(propertyFields, { where: { property_id } });
                await PropertyLocations.update(property_location, { where: { property_location_id } });
                console.log('@Service PropertiesService @Method AddProperties @Message: Property details updated!')
                return { staus: true, message: "Property details updated!" };
            } else {
                // Create new property
                let property_locations_res = await PropertyLocations.create({
                    city,
                    area,
                    landmark
                });

                await PropertyDetails.create({ ...propertyFields, property_location_id: property_locations_res.property_location_id });

                console.log('@Service PropertiesService @Method AddProperties @Message: Property details created!')
                return { staus: true, message: "Property details created!" };
            }
        } catch (error) {
            console.error('@Service PropertiesService @Error: ', error);
            return { staus: false, message: error }
        }
    }

    static async ListProperties(user_id: number) {
        console.log('@Service PropertiesService @Method ListProperties');

        try {
            const property_lists = await sequelize.query(await this.PropertyListQuery(user_id), { type: QueryTypes.SELECT });
            console.log('@Service PropertiesService @Method ListProperties @Message:Property list loaded! Total: ' + property_lists.length)
            return { staus: true, message: "Property list loaded! Total: " + property_lists.length, data: property_lists };
        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async RemoveProperties(property_id: number) {
        console.log('@Service PropertiesService @method RemoveProperties @data::property_id ', property_id);

        try {
            await PropertyDetails.destroy({ where: { property_id: property_id, } });
            await PropertyLocations.destroy({ where: { property_location_id: property_id, } });
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

    static async PropertyListQuery(user_id: number) {
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
            pd.contact_number,
            pl.city,
            pl.area,
            pl.landmark
        FROM property_details pd
                JOIN property_type pt ON (pd.property_type_id = pt.property_type_id)
                JOIN property_status ps ON (pd.property_status_id = ps.property_status_id)
                JOIN property_available_status pas ON (pd.property_available_status_id = pas.property_available_status_id)
                JOIN property_locations pl ON (pd.property_id = pl.property_location_id)
                where pd.created_by = ${user_id}`
        return query;
    }
}