import { useState, useRef, useEffect } from "react";
import "./ImageProcessor.css";
import brokenMirror from "assets/broken-mirror.png"; 

export default function ImageProcessor() {
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const overlaySrc = "/broken-mirror.png";

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

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = image;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply contrast filter to the whole canvas
        ctx.filter = "contrast(1.5)";
        ctx.drawImage(img, 0, 0);
        ctx.filter = "none";
        
        // Apply clip-path effect for left side
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(img.width * 0.38, 0);
        ctx.lineTo(img.width * 0.38, img.height * 0.24);
        ctx.lineTo(img.width * 0.34, img.height * 0.39);
        ctx.lineTo(img.width * 0.43, img.height * 0.62);
        ctx.lineTo(img.width * 0.61, img.height);
        ctx.lineTo(0, img.height);
        ctx.closePath();
        ctx.clip();
        
        // Apply blur and grayscale filter to the left side
        ctx.filter = "blur(4px) grayscale(1)";
        ctx.drawImage(img, 0, 0);
        ctx.restore();
        
        // Apply grayscale to the right side
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
        
        // Draw broken mirror overlay
        const overlay = new Image();
        overlay.src = overlaySrc;
        overlay.crossOrigin = "Anonymous";
        overlay.onload = () => {
          ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
        };
      };
    }
  }, [image]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "mayhem-gen.png";
    link.click();
  };

  return (
    <div className="container">
      <label className="upload-btn">
        Upload Picture
        <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
      </label>
      {image && (
        <>
          <canvas ref={canvasRef} className="canvas" />
          <button onClick={handleDownload} className="download-btn">Download Image</button>
        </>
      )}
    </div>
  );
}


