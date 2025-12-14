import {Client as WorkflowClient } from '@upstash/workflow'

export const workflowClient = new WorkflowClient({
    baseUrl: process.env.QSTASH_UR!,
    token: process.env.UPSTASH_WORKFLOW_TOKEN!,
})