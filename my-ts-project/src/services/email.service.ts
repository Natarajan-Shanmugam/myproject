import fs from "fs";
import path from "path";
import { SESClient } from "@aws-sdk/client-ses";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import handlebars from "handlebars";

const REGION = process.env.AWS_REGION
export const sesClient = new SESClient({ region: REGION });

export class EmailService {

  static async sendEmail(email_template_data: any) {

    console.log('sendEmail email_template_data: ', email_template_data);

    const currentDate = new Date();

    email_template_data.current_year = currentDate.getFullYear();      // 2026
    email_template_data.current_date = currentDate.toLocaleDateString("en-IN"); // 13/3/2026

    email_template_data.price = "₹" + new Intl.NumberFormat("en-IN").format(email_template_data.price);
    email_template_data.property_size = email_template_data.property_size + ' (sqft)';

    // const template_name = 'contact_us_email_template'; 
    const template_name = 'trustyplots-email-template';

    const filePath = path.join(__dirname, `../assets/email-template/${template_name}.html`);
    const source = fs.readFileSync(filePath, "utf8");
    const template = handlebars.compile(source);
    const html = template(email_template_data);

    const email_input_data = {
      from_email: String(process.env.TRUSTYPLOTS_FROM_EMAIL),
      to_email: String(process.env.TRUSTYPLOTS_TO_EMAIL),
      cc_email: String(process.env.TRUSTYPLOTS_CC_EMAIL),
      email_subject: 'TrustyPlots | ' + email_template_data.property_title + ' | ' + email_template_data.current_date,
    }

    const params = {
      Source: email_input_data.from_email, // verified sender
      Destination: {
        ToAddresses: [email_input_data.to_email],
        CcAddresses: [email_input_data.cc_email], // add CC here
      },
      Message: {
        Subject: {
          Data: email_input_data.email_subject,
        },
        Body: {
          Html: {
            Data: html,
          },
        },
      },
    };

    try {
      const result = await sesClient.send(new SendEmailCommand(params));
      console.log("Email sent:", result.MessageId);
      return { status: true, message: "Contact us email send successfully!" }
    } catch (error) {
      console.error("SES error:", error);
    }

  }


}