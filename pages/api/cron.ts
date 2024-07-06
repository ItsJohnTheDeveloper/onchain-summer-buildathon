import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/engine`;

  try {
    await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + process.env.CRON_SECRET,
      },
    });
  } catch (error) {
    console.error("Error hitting Engine API:", error);
    res.status(500).end("Hello Cron! Error hitting Engine API.");
  }
}
