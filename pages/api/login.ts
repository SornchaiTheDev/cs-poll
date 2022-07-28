import type { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import * as firebaseAdmin from "firebase-admin";

if (firebaseAdmin.apps.length === 0) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.CLIENT_EMAIL,
      projectId: process.env.PROJECT_ID,
    }),
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(400).send("Method not allowed");
  try {
    const myku = await axios.post(
      "https://myapi.ku.th/auth/login",
      {
        username: req.body.username,
        password: req.body.password,
      },
      {
        headers: {
          "app-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
        },
      }
    );
    const { firstNameTh, lastNameTh, idCode } = myku.data.user;

    const isAlreadySignUp = await firebaseAdmin
      .firestore()
      .collection("people")
      .doc(idCode)
      .get();
    if (!isAlreadySignUp.exists) {
      await firebaseAdmin
        .firestore()
        .collection("people")
        .doc(idCode)
        .set({
          name: firstNameTh + " " + lastNameTh,
          idCode,
          remains: ["head", "second-head", "secretary", "money"],
          canVote: true,
        });
    }

    res.send(myku.data);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
}
