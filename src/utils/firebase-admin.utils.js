import { initializeApp, cert, getApps } from "firebase-admin/app";

// const privateKeyId =
//   process.env.GOOGLE_APPLICATION_CREDENTIALS_PRIVATE_KEY_ID.replace(
//     /\\n/g,
//     "\n"
//   );

const privateKeyId = process.env.GOOGLE_APPLICATION_CREDENTIALS_PRIVATE_KEY_ID
  ? JSON.parse(
      JSON.stringify(process.env.GOOGLE_APPLICATION_CREDENTIALS_PRIVATE_KEY_ID)
    )
  : undefined;

// const privateKey =
//   process.env.GOOGLE_APPLICATION_CREDENTIALS_PRIVATE_KEY.replace(/\\n/g, "\n")

const privateKey = process.env.GOOGLE_APPLICATION_CREDENTIALS_PRIVATE_KEY
  ? JSON.parse(
      JSON.stringify(process.env.GOOGLE_APPLICATION_CREDENTIALS_PRIVATE_KEY)
    )
  : undefined;

const firebaseCertConfig = {
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
};

let app;
const appInitResponse = { init: false, erro: "no error" };

if (!getApps().length) {
  try {
    app = initializeApp({
      credential: cert(firebaseCertConfig),
      databaseURL: "https://helpdeskmatheus-403de-default-rtdb.firebaseio.com",
    });
    appInitResponse.init = true;
  } catch (err) {
    appInitResponse.erro = err;
    appInitResponse.init = false;
  }
}

export const appInit = appInitResponse;
export default app;
