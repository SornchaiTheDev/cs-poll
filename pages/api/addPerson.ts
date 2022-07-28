import type { NextApiRequest, NextApiResponse } from "next/types";
import * as firebaseAdmin from "firebase-admin";
import jwt_decode from "jwt-decode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(400).send("Method not allowed");
  const { position, name } = req.body;
  const getPosition = await firebaseAdmin
    .firestore()
    .collection(position)
    .get();
  const decoded: any = jwt_decode(req.body.token);
  console.log(decoded);
  if (decoded.exp > Date.now() / 1000) {
    let isExist = false;
    getPosition.docs.map((doc) => {
      if (name === doc.data().name) isExist = true;
    });
    if (!isExist) {
      await firebaseAdmin.firestore().collection(position).add({ name });
      res.send({ status: "success" });
    } else {
      res.send({ status: "already-added" });
    }
  } else {
    res.send("token expired");
  }
}
