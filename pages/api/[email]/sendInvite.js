import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const app = initializeApp(
  {
    credential: applicationDefault(),
    databaseURL: "https://helpdeskmatheus-403de-default-rtdb.firebaseio.com",
  },
  "adminApp"
);

export default async function handler(req, res) {
  try {
    const { method, query } = req;

    switch (method) {
      case "GET":
        const { email } = query;
        const { uid } = await getAuth(app)
          .getUserByEmail(email)
          .then((userRec) => userRec.toJSON());

        res.status(200).json(userRecord);

      default:
        res.status(200).json({ message: "Welcome to API Routes!" });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
