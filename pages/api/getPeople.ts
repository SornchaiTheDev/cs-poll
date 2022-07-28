import type { NextApiRequest, NextApiResponse } from "next/types";
import * as firebaseAdmin from "firebase-admin";
import serviceAccount from "../../cs-poll-firebase-adminsdk-g0vwr-c723888357.json";
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    projectId: serviceAccount.project_id,
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const people = await firebaseAdmin.firestore().collection("people").get();
  const peopleList = people.docs.map((doc) => doc.data());
  res.status(200).json(peopleList);
}
