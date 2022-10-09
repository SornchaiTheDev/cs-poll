import type { NextApiRequest, NextApiResponse } from "next/types";
import jwt_decode from "jwt-decode";
import * as firebaseAdmin from "firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(400).send("Method not allowed");
  try {
    const decoded: any = jwt_decode(req.body.token);

    if (decoded.exp > Date.now() / 1000) {
      const person = await firebaseAdmin
        .firestore()
        .collection("people")
        .doc(decoded.idcode)
        .get();
      if (person.exists) {
        res.send(person.data());
      } else {
        res.send("none");
      }
    } else {
      res.send("token expired");
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
}
