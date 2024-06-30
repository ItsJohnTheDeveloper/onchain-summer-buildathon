import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import * as stytch from "stytch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cookies = new Cookies(req, res);
    const stytchSessionJWT = cookies.get("stytch_session_jwt");
    if (!stytchSessionJWT) {
      return res.status(400).json({ errorString: "No session token found." });
    }

    const stytchClient = new stytch.Client({
      project_id: process.env.STYTCH_PROJECT_ID || "",
      secret: process.env.STYTCH_SECRET || "",
      env:
        process.env.STYTCH_PROJECT_ENV === "live"
          ? stytch.envs.live
          : stytch.envs.test,
    });
    await stytchClient.sessions.authenticateJwt({
      session_jwt: stytchSessionJWT,
    });

    const base = "http://localhost:3000";
    const authUrl = new URL(`${base}/auth`);
    const registerURL = new URL(`${base}/register`);
    const destinationUrl = new URL(`${base}/`);
    registerURL.searchParams.set("redirect", destinationUrl.toString());
    authUrl.searchParams.set("redirect", registerURL.toString());

    const magicLinkUrl = authUrl.toString();
    console.log({ magicLinkUrl });

    await stytchClient.magicLinks.email.invite({
      email: req.body.email!,

      // invite_magic_link_url: "http://localhost:3000/authenticate?redirect="
    });
    res.status(200).json({ message: "Invite sent" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ errorString: "Internal Server Error" });
  }
}
