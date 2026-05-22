export type TempEmailMessage = {
  id: string;
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
  receivedAt: string;
};

export type TempEmailMeta = {
  address: string;
  expiresAt: string;
};

export type TempEmailInboxPayload = TempEmailMeta & {
  token: string;
  ttlSeconds: number;
};

export type TempEmailMessagesPayload = TempEmailMeta & {
  messages: TempEmailMessage[];
  expired?: boolean;
};
