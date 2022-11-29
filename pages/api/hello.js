// import { applicationDefault, initializeApp } from "firebase-admin/app";
// import { getAuth } from "firebase/auth";

// const app = initializeApp({
//   credential: applicationDefault(),
//   databaseURL: "https://helpdeskmatheus-403de.firebaseapp.com",
// });

export default function handler(req, res) {
  try {
    const { method } = req;

    switch (method) {
      case "GET":
        res.status(200).json([
          {
            message: `You tried to get the user from the following email: oi`,
          },
        ]);
        break;
      default:
        res.setHeader("allow", ["GET", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ statusCod: 500, message: err.message });
  }
}
