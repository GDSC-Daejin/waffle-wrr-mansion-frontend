import React, { useState, useEffect } from "react";
import { storage, db } from "../config/firebaseConfig"; // Firebase 설정 불러오기
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage 관련
import { collection, addDoc, getDocs } from "firebase/firestore"; // Firestore 관련
import "../styles/Photo.css"; // CSS 파일

const Photo = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // Firestore에서 가져올 이미지 URL
  const [hover, setHover] = useState(false);

  useEffect(() => {
    fetchImage(); // Firestore에서 이미지 URL 가져오기
  }, []);

  const fetchImage = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "photos"));
      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0].data(); // 첫 번째 이미지만 가져오기 (단순 예제)
        setImageUrl(firstDoc.url);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Firebase Storage에 업로드할 경로 설정
    const storageRef = ref(storage, `photos/${file.name}`);

    try {
      // Firebase Storage에 이미지 업로드
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef); // 업로드된 파일의 URL 가져오기

      // Firestore에 이미지 URL 저장
      await addDoc(collection(db, "photos"), { url: downloadURL });

      setImageUrl(downloadURL); // UI 업데이트
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div
      className="photo-container"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <label htmlFor="fileInput" className="cursor-pointer">
        {imageUrl ? (
          <img src={imageUrl} alt="Uploaded" className="uploaded-image" />
        ) : (
          <div className="upload-placeholder">이미지 업로드</div>
        )}
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default Photo;


