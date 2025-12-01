export interface TransactionEvent {
  id: string;
  client: string;
  projectId: string;
  projectName: string;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionEventsByClient = Record<string, TransactionEvent[]>;

export interface TransactionEventInput {
  client: string;
  code: string;
  description: string;
}
