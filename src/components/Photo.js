import { useState } from "react";
import "../styles/Photo.css"; // CSS 파일 불러오기

const Photo = () => {
  const [image, setImage] = useState(null);
  const [hover, setHover] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="photo-container"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <label htmlFor="fileInput" className="cursor-pointer">
        <img
          src={image || "/assets/strawberry.png"} // 업로드한 이미지 or 기본 이미지
          alt="uploaded"
          className={image ? "uploaded-image" : "strawberry-icon"} // 업로드 여부에 따라 클래스 변경
        />
      </label>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default Photo;

