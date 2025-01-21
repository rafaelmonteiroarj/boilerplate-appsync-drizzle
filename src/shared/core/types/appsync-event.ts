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

export interface AppSyncAuthorizerEvent {
  authorizationToken?: string;
  requestHeaders?: Record<string, string>;
  requestContext: {
    apiId: string;
    accountId: string;
    requestId: string;
    queryString: string;
    variables?: Record<string, any>;
  };
  identity?: {
    sourceIp: string[];
    defaultAuthStrategy: string;
    claims?: Record<string, any>;
  };
}
