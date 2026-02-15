import { Property } from "../models/properties.modal";

interface PropertyData {
    property_id?: number;
    property_type: string;
    property_name: string;
    property_city: string;
    property_price: number;
    created_by?: number;
    updated_by?: number;
}

export class PropertiesService {
    static async AddProperties(data: PropertyData) {
        console.log('@Service PropertiesService @Method AddProperties  @data: ', data);

        const { property_id, created_by, updated_by, ...propertyFields } = data;

        try {
            if (property_id) {
                // Update existing property
                Property.update(propertyFields, { where: { property_id } });
                console.log('@Service PropertiesService @Method AddProperties @Message: Property details updated!')
                return { staus: true, message: "Property details updated!" };
            } else {
                // Create new property
                Property.create({ ...propertyFields, created_by, updated_by, });
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
            const property_lists = await Property.findAll();
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
            return { staus: true, message: "Removed property details!" };
        } catch (error) {
            console.log('@Service PropertiesService @Error: ', error)
        }
    }
}