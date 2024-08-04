export type AppSyncEvent = {
  field: string;
  arguments: { [key: string]: any };
  identity: {
    sub: string;
    issuer: string;
    username: string;
    claims: { [key: string]: any };
    sourceIp: string[];
    defaultAuthStrategy: string;
  };
  source: any;
  request: {
    headers: { [key: string]: string };
  };
  prev: any;
};
