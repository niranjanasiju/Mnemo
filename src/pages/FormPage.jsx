import React, { useState } from 'react';
import imageCompression from 'browser-image-compression'; // Import the compression library
import { db, auth } from '../../firebase'; // Import Firebase Firestore
import { doc, setDoc, collection } from 'firebase/firestore';
import '../styles/FormPage.css';

const MultiImageUpload = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to compress image with very low quality and resolution
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.1, // Compress to very low size, 0.1 MB
      maxWidthOrHeight: 400, // Reduce the resolution to 400px (lower resolution)
      useWebWorker: true, // Use WebWorker for compression
      initialQuality: 0.1, // Set the initial quality to 10% (very low quality)
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Image compression error: ", error);
    }
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
          tag: '', // Initial empty tag
        };
      })
    );
    setImages((prevImages) => [...prevImages, ...compressedImages]);
  };

  // Update tag value in images state
  const handleTagChange = (index, newTag) => {
    const updatedImages = [...images];
    updatedImages[index].tag = newTag; // Set the new tag
    setImages(updatedImages); // Update state with new images array
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Save images in separate documents in Firestore
      const imagePromises = images.map(async (image, index) => {
        const { tag, file } = image;

        // Convert the file to base64 before storing it in Firestore
        const base64 = await convertToBase64(file);

        // Create a new document for each image
        const imageDocRef = doc(collection(db, "users", user.uid, "images"), `image_${index}`);
        
        // Save image metadata (base64, tag) in the document
        await setDoc(imageDocRef, {
          name: file.name,
          tag,
          base64, // Store compressed base64 data
        });
        /*const userDocRef = doc(db, 'users', user.uid);
        await setDoc(
            userDocRef,
            {
              [`images.${tag}`]: arrayUnion({
                name: file.name,
                tag,
                base64, // Store the base64 string instead of the image URL
              }),
            },
            { merge: true } // This ensures the document is created if it doesn't exist
          );*/

        return { base64, tag };
      });

      await Promise.all(imagePromises);
      setImages([]);
      setLoading(false);
      console.log("Compressed image metadata stored successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error storing compressed image metadata:", error);
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
              value={image.tag} // This binds the input field value to the tag
              onChange={(e) => handleTagChange(index, e.target.value)} // Ensure tag change is captured
            />
            <button type="button" onClick={() => handleRemoveImage(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
};

export default MultiImageUpload;
