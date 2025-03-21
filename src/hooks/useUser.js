import { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const useUser = (user) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        setUserData(userSnapshot.data());
      } else {
        await setDoc(userRef, {
          name: user.displayName || "Unknown",
          email: user.email || "",
          joinedAt: serverTimestamp(),
        });
        setUserData({
          name: user.displayName || "Unknown",
          email: user.email || "",
          joinedAt: serverTimestamp(),
        });
      }
    };

    fetchUser();
  }, [user]);

  return userData;
};

export default useUser;
