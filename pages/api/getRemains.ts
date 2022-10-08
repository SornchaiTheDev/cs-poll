import type { NextApiRequest, NextApiResponse } from "next/types";
import * as firebaseAdmin from "firebase-admin";
import jwt_decode from "jwt-decode";

if (firebaseAdmin.apps.length === 0) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.CLIENT_EMAIL,
      projectId: process.env.PROJECT_ID,
    }),
  });
}

type decoded = {
  idcode: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(400).send("Method not allowed");
  try {
    const decoded: any = jwt_decode(req.body.token);

    if (decoded.exp > Date.now() / 1000) {
      const decoded: decoded = jwt_decode(req.body.token as string);
      const person = await firebaseAdmin
        .firestore()
        .collection("people")
        .doc(decoded.idcode)
        .get();

      res.send({ position: person.data()!.position });
    } else {
      res.send("token expired");
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
}
