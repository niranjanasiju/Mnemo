import React, { useState } from 'react';
import imageCompression from 'browser-image-compression'; // Import the compression library
import '../styles/FormPage.css';
import { auth, db } from "../../firebase"; // Ensure Firebase is configured properly
import { doc, setDoc, arrayUnion } from "firebase/firestore";

const MultiImageUpload = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to compress image
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.5, // Compress to 0.5 MB
      maxWidthOrHeight: 600, // Resize to 600px (or less)
      useWebWorker: true,
    };


    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Image compression error: ', error);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Handle image file input change
  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files);
    const compressedImages = await Promise.all(
      files.map(async (file) => {
        const compressedFile = await compressImage(file);
        return {
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
          tag: '', // Initialize tag as empty
        };
      })
    );
    setImages((prevImages) => [...prevImages, ...compressedImages]);
  };

  // Handle tag change for a specific image
  const handleTagChange = (index, newTag) => {
    const updatedImages = [...images];
    updatedImages[index].tag = newTag; // Update the tag of the specific image
    setImages(updatedImages);
  };

  // Handle form submit (save compressed images to Firestore)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const imageMetadataPromises = images.map(async (image) => {
        const { tag, file } = image;

        // Convert the compressed file to base64 (or binary data)
        const base64 = await convertToBase64(file);

        // Save image metadata (including base64 string) in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(
          userDocRef,
          {
            [`images.${tag}`]: arrayUnion({
              name: file.name,
              tag,
              base64, // Store compressed base64 data
            }),
          },
          { merge: true }
        );

        return { base64, tag };
      });

      await Promise.all(imageMetadataPromises);
      setImages([]);
      setLoading(false);
      console.log('Compressed image metadata stored successfully!');
    } catch (error) {
      setLoading(false);
      console.error('Error storing compressed image metadata:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload Images:
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </label>

      <div>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.preview} alt={`Preview ${index}`} />
            <input
              type="text"
              placeholder="Enter tag"
              value={image.tag}
              onChange={(e) => handleTagChange(index, e.target.value)} // Update tag here
            />
            <button type="button" onClick={() => handleRemoveImage(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Submit'}
      </button>
    </form>
  );
};

export default MultiImageUpload;
