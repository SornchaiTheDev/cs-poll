import type { NextApiRequest, NextApiResponse } from "next/types";
import * as firebaseAdmin from "firebase-admin";
import jwt_decode from "jwt-decode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(400).send("Method not allowed");
  try {
    const { head, secondHead, secretary, money } = req.body;
    const decoded: any = jwt_decode(req.body.token);
    if (decoded.exp > Date.now() / 1000) {
      const person = await firebaseAdmin
        .firestore()
        .collection("people")
        .doc(decoded.idcode)
        .get();
      if (person.data()!.canVote) {
        await firebaseAdmin
          .firestore()
          .collection("head")
          .doc(head)
          .update({ vote: firebaseAdmin.firestore.FieldValue.increment(1) });

        await firebaseAdmin
          .firestore()
          .collection("second-head")
          .doc(secondHead)
          .update({ vote: firebaseAdmin.firestore.FieldValue.increment(1) });

        await firebaseAdmin
          .firestore()
          .collection("secretary")
          .doc(secretary)
          .update({ vote: firebaseAdmin.firestore.FieldValue.increment(1) });

        await firebaseAdmin
          .firestore()
          .collection("money")
          .doc(money)
          .update({ vote: firebaseAdmin.firestore.FieldValue.increment(1) });

        await firebaseAdmin
          .firestore()
          .collection("people")
          .doc(decoded.idcode)
          .update({
            canVote: false,
          });
      } else {
        throw Error("already voted");
      }

      res.send({ code: 200, status: "success" });
    } else {
      throw Error("token expired");
    }
  } catch (err) {
    res.status(500).send("Internal server error");
  }
}
