import { verify, JwtPayload } from "jsonwebtoken";

export const handler = async (event: any) => {
  try {
    console.debug("Event: ", event);
    const token = event.authorizationToken?.split(" ")[1];
    console.debug("token: ", token);
    verify(token, `${process.env.JWT_SECRET}`) as JwtPayload;
    console.debug("verified", verify(token, `${process.env.JWT_SECRET}`));

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
