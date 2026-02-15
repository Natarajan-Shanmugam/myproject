import { Property } from "../models/properties.modal";

export class PropertiesService {
    static async AddProperties(data: any) {
        console.log('@Controller PropertiesController @Service PropertiesService data: ', data);

        try {
            //update property
            if (data.property_id) {
                return await Property.update({
                    property_type: data.property_type,
                    property_name: data.property_name,
                    property_city: data.property_city,
                    property_price: data.property_price
                }, { where: { property_id: data.property_id } })
            }
            //create a new propery
            return await Property.create({
                property_type: data.property_type,
                property_name: data.property_name,
                property_city: data.property_city,
                property_price: data.property_price,
                created_by: data.created_by,
                updated_by: data.updated_by,
            })
        } catch (error) {
            console.log('@Controller PropertiesController @Service PropertiesService @Error: ', error)
        }
    }

    static async ListProperties() {
        console.log('@Controller PropertiesController @Service PropertiesService: ');

        try {
            return await Property.findAll();
        } catch (error) {
            console.log('@Controller PropertiesController @Service PropertiesService @Error: ', error)
        }
    }

    static async RemoveProperties(property_id: number) {
        console.log('@Controller PropertiesController @Service PropertiesService: ');

        try {
            return await Property.destroy({
                where: {
                    property_id: property_id,
                },
            });
        } catch (error) {
            console.log('@Controller PropertiesController @Service PropertiesService @Error: ', error)
        }
    }
}