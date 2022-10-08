import type { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import * as firebaseAdmin from "firebase-admin";

import crypto from "crypto";

const encodeString = (str: string) => {
  return crypto
    .publicEncrypt(
      {
        key: "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAytOhlq/JPcTN0fX+VqObE5kwIaDnEtso2KGHdi9y7uTtQA6pO4fsPNJqtXOdrcfDgp/EQifPwVRZpjdbVrD6FgayrQQILAnARKzVmzwSMDdaP/hOB6i9ouKsIhN9hQUmUhbhaMkh7UXoxGW+gCSK8dq0+FJVnlt1dtJByiVAJRi2oKSdLRqNjk8yGzuZ6SrEFzAgYZwmQiywUF6V1ZaMUQDz8+nr9OOVU3c6Z2IQXCbOv6S7TAg0VhriFL18ZxUPS6759SuKC63VOOSf4EEHy1m0qBgpCzzlsB7D4ssF9x0ZVXLREFrqikP71Hg6tSGcu4YBKL+VwIDWWaXzz6szxeDXdYTA3l35P7I9uBUgMznIjTjNaAX4AXRsJcN9fpF7mVq4eK1CorBY+OOzOc+/yVBpKysdaV/yZ+ABEhX93B2kPLFSOPUKjSPK2rtqE6h2NSl5BFuGEoVBerKn+ymOnmE4/SDBSe5S6gIL5vwy5zNMsxWUaUF5XO9Ez+2v8+yPSvQydj3pw5Rlb07mAXcI18ZYGClO6g/aKL52KYnn1FZ/X3r8r/cibfDbuXC6FRfVXJmzikVUqZdTp0tOwPkh4V0R63l2RO9Luy7vG6rurANSFnUA9n842KkRtBagQeQC96dbC0ebhTj+NPmskklxr6/6Op/P7d+YY76WzvQMvnsCAwEAAQ==\n-----END PUBLIC KEY-----",
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(str, "utf8")
    )
    .toString("base64");
};

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
        username: encodeString(req.body.username),
        password: encodeString(req.body.password),
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
          position: null,
          canVote: true,
        });
    }

    res.send(myku.data);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
}
