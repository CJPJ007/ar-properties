// lib/firebaseAdmin.ts
import * as admin from "firebase-admin"
import path from "path"

if (!admin.apps.length) {
  const serviceAccount = require(path.resolve("../config/service-account.json"))

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export { admin }
