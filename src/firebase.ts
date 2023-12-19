import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { config } from "dotenv";

config();

const serviceAccount = require("./serviceAccountKey.json");

export const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.FIRBASE_URL as string,
});

export const db = getFirestore(app);
