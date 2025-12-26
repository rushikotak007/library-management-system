import {Client as WorkflowClient } from '@upstash/workflow'
import { Client as QStashClient, resend } from "@upstash/qstash";
import config from './config';

export const workflowClient = new WorkflowClient({
    baseUrl: process.env.QSTASH_UR!,
    token: process.env.UPSTASH_WORKFLOW_TOKEN!,
})

const qstashClient = new QStashClient({ token: config.env.upstash.qstashToken });

export const sendEmail = async ({email, subject, message} : {email: string, subject: string, message: string}) => {

    await qstashClient.publishJSON({
      api: {
        name: "email",
        provider: resend({ token: config.env.resendToken! }),
      },
      body: {
        from: "Rushi Kotak <clientsupport@pixelperfectmedia.org>",
        to: email,
        subject: subject,
        html: message,
      },
    });
}
