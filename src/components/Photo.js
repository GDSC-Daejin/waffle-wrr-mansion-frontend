import { useState, useEffect } from "react";
import { db, auth } from "../config/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import "../styles/Photo.css";

const Photo = ({ date }) => {
  const [image, setImage] = useState(null);
  const [hover, setHover] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchImage(user.uid);
      }
    });
    return () => unsubscribe();
  }, [date]);

  const fetchImage = async (uid) => {
    if (!uid) return;
    const docRef = doc(db, "users", uid, "todos", date);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().photo) {
      setImage(docSnap.data().photo.url);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !userId) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result;
      setImage(imageData);

      const docRef = doc(db, "users", userId, "todos", date);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, { photo: { url: imageData, timestamp: new Date() } });
      } else {
        await setDoc(docRef, { photo: { url: imageData, timestamp: new Date() } });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="photo-container" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <label htmlFor="fileInput" className="cursor-pointer">
        <img src={image || "/assets/strawberry.png"} alt="uploaded" className={image ? "uploaded-image" : "strawberry-icon"} />
      </label>
      <input type="file" id="fileInput" accept="image/*" className="hidden" onChange={handleImageUpload} />
    </div>
  );
};

export default Photo;