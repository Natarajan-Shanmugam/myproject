import { Property } from "../models/property_details.modal";
import { PropertyLocations } from "../models/property_locations.modal";
import PropertyType from "../models/property_type.model";
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
                await Property.update(propertyFields, { where: { property_id } });
                await PropertyLocations.update(property_location, { where: { property_location_id } });
                console.log('@Service PropertiesService @Method AddProperties @Message: Property details updated!')
                return { staus: true, message: "Property details updated!" };
            } else {
                // Create new property
                let Property_res = await Property.create({ ...propertyFields });
                await PropertyLocations.create({
                    city,
                    area,
                    landmark,
                    property_id: Property_res.property_id

                });

                console.log('@Service PropertiesService @Method AddProperties @Message: Property details created!')
                return { staus: true, message: "Property details created!" };
            }
        } catch (error) {
            console.error('@Service PropertiesService @Error: ', error);
            return { staus: false, message: error }
        }
    }

    static async ListProperties() {
        console.log('@Service PropertiesService @Method ListProperties');

        try {
            const property_lists = await sequelize.query(await this.PropertyListQuery(), { type: QueryTypes.SELECT });
            console.log('@Service PropertiesService @Method ListProperties @Message:Property list loaded! Total: ' + property_lists.length)
            return { staus: true, message: "Property list loaded! Total: " + property_lists.length, data: property_lists };
        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async RemoveProperties(property_id: number) {
        console.log('@Service PropertiesService @method RemoveProperties @data::property_id ', property_id);

        try {
            await Property.destroy({ where: { property_id: property_id, } });
            await PropertyLocations.destroy({ where: { property_id: property_id, } });
            return { staus: true, message: "Removed property details!" };
        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async SeedData(type: string) {
        console.log('@Service PropertiesService @method RemoveProperties @data::type ', type);

        try {
            let property_type = await PropertyType.findAll();
            if (property_type) {
                return { staus: true, message: "Seed data loaded!", data: property_type };
            }
            return { staus: true, data: [], message: "Seed data not Found!" };

        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }

    static async PropertyListQuery() {
        const query = `SELECT 
                            pd.property_id,
                            pl.property_location_id,
                            pt.property_type_name,
                            pd.property_title,
                            pd.property_listing_type,
                            pd.property_status,
                            pd.property_price,
                            pd.contact_number,
                            pl.city,
                            pl.area,
                            pl.landmark
                        FROM property_details pd
                            JOIN property_type pt ON (pd.property_type_id = pt.property_type_id)
                            JOIN property_locations pl ON (pd.property_id = pl.property_location_id)`
        return query;
    }
}