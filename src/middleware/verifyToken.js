
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, "../../", process.env.FIREBASE_KEY_PATH);

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Firebase JSON not found at ${serviceAccountPath}`);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1]; 

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("Firebase token verification error:", error);
    return res.status(403).json({ message: "Forbidden access" });
  }
};

export default verifyToken;