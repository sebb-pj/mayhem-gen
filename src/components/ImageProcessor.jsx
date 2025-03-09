import { useState } from "react";
import "./ImageProcessor.css";
import brokenMirror from "assets/broken-mirror.png"; 

export default function ImageProcessor() {
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
    <div className="container">
      <input type="file" accept="image/*" onChange={handleImageUpload} className="upload-btn" />
      {image && (
        <div className="image-container">
          <img src={image} alt="Uploaded" className="uploaded-image" />
          <img src={brokenMirror} alt="Broken Mirror Overlay" className="overlay" />
        </div>
      )}
    </div>
  );
}
