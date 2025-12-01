export interface TransactionEventPayload {
  id: string;
  client: string;
  projectId: string;
  projectName: string;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionEventsResponse = Record<string, TransactionEventPayload[]>;
