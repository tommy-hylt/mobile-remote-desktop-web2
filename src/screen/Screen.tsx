import { useState, useEffect, useCallback } from 'react';
import './Screen.css';

export const Screen = () => {
  const [images, setImages] = useState<string[]>([]);

  const fetchCapture = useCallback(async () => {
    try {
      const response = await fetch('/capture');
      if (response.ok) {
        if (response.status === 204) {
          return;
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImages((prev) => {
          const newImages = [...prev, url];
          if (newImages.length > 3) {
            // Optional: revoke old url to be nice, though browser handles simple cases well
            // URL.revokeObjectURL(newImages[0]);
            return newImages.slice(newImages.length - 3);
          }
          return newImages;
        });
      } else {
        console.error('Failed to fetch capture:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching capture:', error);
    }
  }, []);

  useEffect(() => {
    fetchCapture();
  }, [fetchCapture]);

  const handleClick = () => {
    fetchCapture();
  };

  if (images.length === 0) {
    return (
      <div className="screen-Screen" onClick={handleClick}>
        <p>Loading remote screen...</p>
      </div>
    );
  }

  return (
    <div className="screen-Screen" onClick={handleClick}>
      {images.map((imgUrl, index) => (
        <img
          key={index}
          src={imgUrl}
          alt={`Remote Screen ${index}`}
          className="image"
        />
      ))}
    </div>
  );
};
