import React, { useState } from "react";

const Photo = () => {
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  return (
    <div className="photo-section">
      <h3>사진 기록장</h3>
      {photo ? <img src={photo} alt="Uploaded" /> : <p>사진을 추가하세요.</p>}
      <input type="file" accept="image/*" onChange={handlePhotoChange} />
    </div>
  );
};

export default Photo;
