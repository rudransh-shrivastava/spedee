import { SES } from "aws-sdk";

const client = new SES({ region: process.env.AWS_SES_REGION });
export const sendTestEmail = async (
  to: string,
  from: string,
  subject: string,
  body: string
) => {
  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: { Data: body },
      },
      Subject: { Data: subject },
    },
    Source: from,
  };

  try {
    const result = await client.sendEmail(params).promise();
    return result;
  } catch (error) {
    throw new Error(`Failed to send email: ${error}`);
  }
};
