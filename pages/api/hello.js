import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { sendInviteToToProject } from "../../src/utils/firebase.utils";

const privateKeyId =
  process.env.GOOGLE_APPLICATION_CREDENTIALS_PRIVATE_KEY_ID.replace(
    /\\n/g,
    "\n"
  );

const privateKey =
  process.env.GOOGLE_APPLICATION_CREDENTIALS_PRIVATE_KEY.replace(/\\n/g, "\n");

const app = initializeApp({
  credential: cert({
    type: "service_account",
    project_id: "helpdeskmatheus-403de",
    private_key_id: privateKeyId,
    private_key: privateKey,
    client_email:
      "firebase-adminsdk-wo70f@helpdeskmatheus-403de.iam.gserviceaccount.com",
    client_id: "103480444660939452305",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wo70f%40helpdeskmatheus-403de.iam.gserviceaccount.com",
  }),
  databaseURL: "https://helpdeskmatheus-403de-default-rtdb.firebaseio.com",
});

export default async function handler(req, res) {
  try {
    const { method } = req;
    switch (method) {
      case "POST":
        const { type } = req.body.body;
        if (type === "sendInvite") {
          const { projectUid, name, email, projectName } = req.body.body;

          const user = await getAuth(app)
            .getUserByEmail(email)
            .then((userRec) => userRec.toJSON())
            .catch((err) => {
              res.status(404).json({
                message: err.code,
              });
            });
          if (user) {
            await sendInviteToToProject(
              projectUid,
              projectName,
              name,
              user.uid
            );
            res.status(200).json({
              statusCode: 200,
              message: "succesfully send your invite",
            });
          }
        }
        if (type === "acceptInvite") {
          const { projectUid, name, uid } = req.body.body;

          console.log("accept start", projectUid);

          let projectInfo;
          await getDatabase(app)
            .ref("/projects/" + projectUid)
            .once("value", (snapshot) => {
              projectInfo = snapshot.val();
            });

          const projectInfoToSend = {
            createdAt: projectInfo.createdAt,
            createdBy: projectInfo.createdBy,
            key: projectInfo.key,
            name: projectInfo.name,
          };

          console.log(projectInfoToSend);

          const db = getDatabase(app);
          const usersRef = db.ref("/projects/" + projectUid + "/users/");
          const userRef = usersRef.child(uid);
          await userRef.set(name);

          const userProjectsRef = db.ref("/users/" + uid + "/projects/");
          const projectRef = userProjectsRef.child(projectInfo.key);
          await projectRef.set(projectInfoToSend);

          const invitesRef = db.ref("/users/" + uid + "/invites/");
          const inviteRef = invitesRef.child(projectInfo.key);
          await inviteRef.set(null);

          res.status(200).json({
            message: "you successfully accepted your invite!",
          });
        }
        break;
      default:
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
