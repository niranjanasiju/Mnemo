import React, { useState } from 'react';
import imageCompression from 'browser-image-compression'; // Import the compression library
import { db, auth } from '../../firebase'; // Import Firebase Firestore
import { doc, setDoc, collection } from 'firebase/firestore';
import '../styles/FormPage.css';

const MultiImageUpload = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // New state for user fields
  const [userName, setUserName] = useState('');
  const [userNativePlace, setUserNativePlace] = useState('');
  const [userHobbies, setUserHobbies] = useState('');
  const [userAge, setUserAge] = useState('');
  
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
          tagName: '', // Initial tagName
          relation: '', // Initial relation
        };
      })
    );
    setImages((prevImages) => [...prevImages, ...compressedImages]);
  };

  // Handle tagName and relation input change
  const handleTagChange = (index, field, value) => {
    const updatedImages = [...images];
    updatedImages[index][field] = value; // Update tagName or relation based on field
    setImages(updatedImages); // Update images state
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

      // Save user metadata
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        name: userName,
        nativePlace: userNativePlace,
        hobbies: userHobbies.split(',').map(hobby => hobby.trim()),
        age: userAge
         // Split and clean hobbies
      });

      // Save images and their tags in Firestore
      const imagePromises = images.map(async (image, index) => {
        const { tagName, relation, file } = image;

        // Convert the file to base64 before storing it in Firestore
        const base64 = await convertToBase64(file);

        // Create a new document for each image
        const imageDocRef = doc(collection(db, "users", user.uid, "images"), `image_${index}`);
        
        // Save image metadata (base64, tagName, relation) in the document
        await setDoc(imageDocRef, {
          name: file.name,
          relation,
          base64, // Store compressed base64 data
        });

        return { base64, tagName, relation };
      });

      await Promise.all(imagePromises);
      setImages([]); // Clear images after successful upload
      setLoading(false);
      console.log("User and image metadata stored successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error storing data:", error);
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
      {/* User Information */}
      <label>
        Name:
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Native Place:
        <input
          type="text"
          value={userNativePlace}
          onChange={(e) => setUserNativePlace(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Hobbies (separated by commas):
        <input
          type="text"
          value={userHobbies}
          onChange={(e) => setUserHobbies(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Age:
        <input
          type="text"
          value={userAge}
          onChange={(e) => setUserAge(e.target.value)}
          required
        />
      </label>

      {/* Image Upload */}
      <label>
        Upload Familiar Faces:
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
            
            <div>
              <label>
                Relation with User:
                <input
                  type="text"
                  value={image.relation}
                  onChange={(e) => handleTagChange(index, 'relation', e.target.value)}
                  required
                />
              </label>
            </div>
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
