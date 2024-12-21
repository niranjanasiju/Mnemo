import React, { useState } from 'react';
import imageCompression from 'browser-image-compression'; // Import the compression library
import { db, auth } from '../../firebase'; // Import Firebase Firestore
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import '../styles/FormPage.css';
import Navbar from '../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom'; // For navigation

const MultiImageUpload = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // New state for user fields
  const [userName, setUserName] = useState('');
  const [userNativePlace, setUserNativePlace] = useState('');
  const [userHobbies, setUserHobbies] = useState('');
  const [userAge, setUserAge] = useState('');
  const navigate = useNavigate(); // Updated navigation function

  const handleProceed=()=>{
    navigate('/game1');
  };
  // Function to compress image with very low quality and resolution
  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 400,
      useWebWorker: true,
      initialQuality: 0.1,
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
          tagName: '',
          relation: '',
        };
      })
    );
    setImages((prevImages) => [...prevImages, ...compressedImages]);
  };

  // Handle tagName and relation input change
  const handleTagChange = (index, field, value) => {
    const updatedImages = [...images];
    updatedImages[index][field] = value;
    setImages(updatedImages);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  // Convert file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      // Reference to the user's main document
      const userDocRef = doc(db, "users", user.uid);
  
      // Save or update user metadata
      await setDoc(
        userDocRef,
        {
          name: userName,
          nativePlace: userNativePlace,
          hobbies: userHobbies.split(',').map((hobby) => hobby.trim()),
          age: userAge,
          scores: {
            game1: 0,
            game2: 0,
            game3: 0,
            game4: 0,
          },
        },
        { merge: true } // Ensures data is updated, not overwritten
      );
  
      // Save images and their tags in Firestore
      const imagePromises = images.map(async (image) => {
        const { relation, file } = image;
  
        // Convert the file to base64 before storing it in Firestore
        const base64 = await convertToBase64(file);
  
        // Add a new document for each image in the 'images' subcollection
        const imageCollectionRef = collection(db, "users", user.uid, "images");
  
        await addDoc(imageCollectionRef, {
          name: file.name || `image-${Date.now()}`, // Unique file name
          relation,
          base64,
        });
      });
  
      await Promise.all(imagePromises);
  
      // Clear the form after successful submission
      setImages([]);
      setLoading(false);
      console.log("User and image metadata stored successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error storing data:", error);
    }
  };
  

  return (
    <>
    <Navbar/>
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
    <button onClick={handleProceed}>Proceed</button>
    </>
    
  );
};

export default MultiImageUpload;
