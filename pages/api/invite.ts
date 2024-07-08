import type { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import * as stytch from "stytch";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);

  console.log({ email: body.email });

  const roomId = body?.roomId;
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

    const authUrl = new URL(`${BASE_URL}/authenticate`);
    const registerURL = new URL(`${BASE_URL}/register`);
    const destinationUrl = new URL(
      `${BASE_URL}/${roomId ? `room/${roomId}` : ""}`
    );
    registerURL.searchParams.set("redirect", destinationUrl.toString());
    authUrl.searchParams.set("redirect", registerURL.toString());

    const magicLinkUrl = authUrl.toString();

    await stytchClient.magicLinks.email.invite({
      email: body.email!,
      invite_magic_link_url: magicLinkUrl,
    });
    return res.status(200).json({ message: "Invite sent" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ errorString: "Internal Server Error" });
  }
}
