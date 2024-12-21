import React, { useState } from 'react';
import { db, auth } from '../../../firebase'; // Adjust import paths based on your project
import { doc, getDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import './FamiliarFaces.css'; // Import the custom CSS file
const FamiliarFaces = () => {
  const [category, setCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomCategoryAndImage = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) {
        alert('User not logged in!');
        return;
      }

      // Reference to the user's document
      const userDocRef = doc(db, 'users', userId);

      // Fetch user's document
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        alert('User data not found!');
        return;
      }

      // Get all available categories (images.family, images.friend, etc.)
      const userData = userDocSnap.data();
      const categories = Object.keys(userData).filter(key => key.startsWith('images.')); // Filter categories that start with "images."

      if (!categories.length) {
        alert('No categories found!');
        return;
      }

      // Select a random category
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      // Trim the "images." part from the category name
      const categoryName = randomCategory.replace('images.', ''); // Removes 'images.' prefix
      setCategory(categoryName);

      // Get the images from the selected category (e.g., images.family)
      const categoryImages = userData[randomCategory]; // Access the array of images from the category

      if (!categoryImages || categoryImages.length === 0) {
        alert(`No images found in category "${categoryName}"!`);
        return;
      }

      // Select a random image from the chosen category
      const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];

      // Log the randomImage to inspect the data structure
      console.log('Random Image Data:', randomImage);

      // Check if base64 exists in the randomImage and update the selectedImage state
      const base64Image = randomImage?.base64;
       // Access the base64 field
       console.log(base64Image);
      if (base64Image) {
        setSelectedImage(base64Image); // Set the base64 string if valid
      } else {
        alert('Base64 image data not found!');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch game data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start-game-container">
      <h1 className="title">Start Game</h1>

      <button
        className="start-game-btn"
        onClick={fetchRandomCategoryAndImage}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Start Game'}
      </button>

      {category && <h2 className="category">Category: {category}</h2>}

      {selectedImage ? (
        <div className="image-container">
          <img
            src={selectedImage} // Use the base64 string directly for the src
            alt="Selected"
            className="selected-image"
          />
          {/* Safely check if tags exist and are an array */}
          <p className="tags">
            Tag(s): {Array.isArray(selectedImage.tag) ? selectedImage.tag.join(', ') : 'No tags available'}
          </p>
        </div>
      ) : (
        <p className="loading-message">Loading image...</p> // Fallback message while loading
      )}
    </div>
  );
};

export default FamiliarFaces;
