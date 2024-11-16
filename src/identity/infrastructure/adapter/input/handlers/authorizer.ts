import { verify, JwtPayload } from "jsonwebtoken";

export const handler = async (event: any) => {
  try {
    const token = event.authorizationToken?.split(" ")[1];
    verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;

    return {
      isAuthorized: true,
      resolverContext: {},
      deniedFields: [],
      ttlOverride: 300,
    };
  } catch (err) {
    console.error("Error: ", err);
    throw new Error("Unauthorized");
  }
};
