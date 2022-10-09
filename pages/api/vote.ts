import type { NextApiRequest, NextApiResponse } from "next/types";
import * as firebaseAdmin from "firebase-admin";
import jwt_decode from "jwt-decode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(400).send("Method not allowed");
  try {
    const { head, secondHead, secretary, money, noVote } = req.body;
    const decoded: any = jwt_decode(req.body.token);
    if (decoded.exp > Date.now() / 1000) {
      if (noVote) {
        firebaseAdmin
          .firestore()
          .collection("people")
          .doc(decoded.idcode)
          .update({ canVote: false });
        await firebaseAdmin
          .firestore()
          .collection("novotes")
          .doc("count")
          .set({ amount: firebaseAdmin.firestore.FieldValue.increment(1) });
        return res.send({ code: 200, status: "success" });
      }

      const person = await firebaseAdmin
        .firestore()
        .collection("people")
        .doc(decoded.idcode)
        .get();
      if (person.data()!.canVote) {
        await firebaseAdmin
          .firestore()
          .collection("head")
          .doc(head.split(":")[1])
          .update({ vote: firebaseAdmin.firestore.FieldValue.increment(1) });

        await firebaseAdmin
          .firestore()
          .collection("second-head")
          .doc(secondHead.split(":")[1])
          .update({ vote: firebaseAdmin.firestore.FieldValue.increment(1) });

        await firebaseAdmin
          .firestore()
          .collection("secretary")
          .doc(secretary.split(":")[1])
          .update({ vote: firebaseAdmin.firestore.FieldValue.increment(1) });

        await firebaseAdmin
          .firestore()
          .collection("money")
          .doc(money.split(":")[1])
          .update({ vote: firebaseAdmin.firestore.FieldValue.increment(1) });

        await firebaseAdmin
          .firestore()
          .collection("people")
          .doc(decoded.idcode)
          .update({
            canVote: false,
          });

        await firebaseAdmin
          .firestore()
          .collection("people")
          .doc(decoded.idcode)
          .set(
            {
              votes: [
                head.split(":")[0],
                secondHead.split(":")[0],
                secretary.split(":")[0],
                money.split(":")[0],
              ],
            },
            { merge: true }
          );
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
