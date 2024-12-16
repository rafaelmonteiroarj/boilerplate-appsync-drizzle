import { JwtPayload } from "jsonwebtoken";

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

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  active: boolean;
  isAdmin: boolean;
  questionlimitQuota: number;
  createdAt: string;
  updatedAt: string;
  origin: string;
  grantAccessGenia: string;

  originLogin: string;
}
