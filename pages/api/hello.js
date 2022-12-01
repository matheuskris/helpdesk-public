import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import {
  sendInviteToToProject,
  getProjectInfo,
  acceptInvite,
} from "../../src/utils/firebase.utils";

const app = initializeApp(
  {
    credential: applicationDefault(),
    databaseURL: "https://helpdeskmatheus-403de-default-rtdb.firebaseio.com",
  },
  "adminAuthApp"
);

export default async function handler(req, res) {
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
            res
              .status(200)
              .json({
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
