import { useState } from "react";

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
    <div className="relative flex justify-center items-center">
      {/* 이미지 업로드 버튼 */}
      <label
        className="relative cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {image ? (
          <div className="w-[333.87px] h-[371.2px] overflow-hidden rounded-[20px] bg-gray-200">
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full object-cover" // 비율을 유지하며 자르기
            />
          </div>
        ) : (
          <div className="w-[333.87px] h-[371.2px] flex justify-center items-center bg-gray-200 rounded-[20px]">
            <span
              className="text-[64px] font-bold"
              style={{
                color: "#FFFFFF",
                textShadow: "4px 4px 0px #5C4033",
              }}
            >
              사진
            </span>
          </div>
        )}

        {/* 드래그 시 "+ 사진 넣기" 표시 */}
        {!image && hover && (
          <div className="absolute inset-0 flex justify-center items-center">
            <span
              className="text-[64px] font-bold"
              style={{
                color: "#FFFFFF",
                textShadow: "4px 4px 0px #5C4033",
              }}
            >
              + 사진 넣기
            </span>
          </div>
        )}

        {/* 파일 입력 필드 */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>
    </div>
  );
};

export default Photo;

















