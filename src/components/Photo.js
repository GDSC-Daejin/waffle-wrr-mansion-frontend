import { useState } from "react";

const Photo = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState(null);

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
      style={{
        position: "relative",
        width: "333.87px",
        height: "371.2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: isDragging ? "2px dashed #ff7eb3" : "none",
        transition: "border 0.3s ease-in-out"
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
        console.log("Dragging started");
      }}
      onDragLeave={() => {
        setIsDragging(false);
        console.log("Dragging ended");
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result);
          };
          reader.readAsDataURL(file);
        }
      }}
    >
      {image ? (
        <img
          src={image}
          alt="uploaded"
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
        />
      ) : isDragging ? (
        <img
          src="/blur_strawberry.png"
          alt="Drag Icon"
          style={{ width: "333.87px", height: "371.2px", position: "absolute" }}
        />
      ) : (
        <label htmlFor="fileInput" style={{ cursor: "pointer", fontSize: "20px", fontWeight: "bold" }}>
          사진
        </label>
      )}

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default Photo;






