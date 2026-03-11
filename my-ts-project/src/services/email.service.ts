import fs from "fs";
import path from "path";
import { SESClient } from "@aws-sdk/client-ses";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import handlebars from "handlebars";

const REGION = process.env.AWS_REGION
export const sesClient = new SESClient({ region: REGION });

export class EmailService {

  static async sendEmail(email_template_data: any) {

    const template_name = 'contact_us_email_template';

    const filePath = path.join(__dirname, `../assets/email-template/${template_name}.html`);
    const source = fs.readFileSync(filePath, "utf8");
    const template = handlebars.compile(source);
    const html = template(email_template_data);

    const email_input_data = {
      from_email: 'trustyplots27@gmail.com',
      to_email: 'natrajan.raj@gmail.com',
      email_subject: 'Welcome to TrustyPlots Test'
    }

    const params = {
      Source: email_input_data.from_email, // verified sender
      Destination: {
        ToAddresses: [email_input_data.to_email],
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