import { db } from "../config/firebaseConfig";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export async function Users(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      name: user.displayName || "Unknown",
      email: user.email || "",
      joinedAt: serverTimestamp(),
    });
  }
}
