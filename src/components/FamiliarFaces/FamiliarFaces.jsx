import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";

const FamiliarFaces = () => {
  const [randomImage, setRandomImage] = useState(null); // Random image from Firebase
  const [generatedImages, setGeneratedImages] = useState([]); // URLs for images from Hugging Face
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0); // User's score

  // Function to fetch a random image
  const fetchRandomImage = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const imagesRef = collection(db, "users", user.uid, "images");
      const snapshot = await getDocs(imagesRef);

      if (snapshot.empty) throw new Error("No images found!");

      const images = snapshot.docs.map((doc) => doc.data());
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setRandomImage(randomImage);
    } catch (error) {
      console.error("Error fetching random image:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to call Hugging Face API
  const query = async (prompt) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium-diffusers",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch from Hugging Face API`);
    }

    const blob = await response.blob(); // Get the response as a Blob
    return URL.createObjectURL(blob); // Create a URL for the Blob
  };

  // Function to generate incorrect images
  const generateIncorrectImages = async () => {
    if (!randomImage) return;

    setLoading(true);
    setGeneratedImages([]); // Reset generated images
    const incorrectVariants = ["random variant 1", "random variant 2", "random variant 3"];
    try {
      const newImages = [];
      // Include the correct image for the selection
      newImages.push(randomImage.base64);

      for (const variant of incorrectVariants) {
        const prompt = `${randomImage.tagName} (${variant})`; // Alter prompt for incorrect images
        const imageUrl = await query(prompt);
        newImages.push(imageUrl);
      }

      // Shuffle the images to randomize their order
      setGeneratedImages(newImages.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error("Error generating incorrect images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageClick = (image) => {
    if (image === randomImage.base64) {
      alert("Correct!");
      setScore((prevScore) => prevScore + 1);
    } else {
      alert("Incorrect!");
    }

    // Fetch a new random image after the selection
    fetchRandomImage();
    setGeneratedImages([]);
  };

  // Fetch a random image when the component mounts
  useEffect(() => {
    fetchRandomImage();
  }, []);

  return (
    <div>
      <h2>Score: {score}</h2>
      {loading && <p>Loading...</p>}
      {randomImage && (
        <div>
          <h3>{randomImage.tagName}</h3>
          <img src={randomImage.base64} alt="Random from Firebase" />
          <button onClick={generateIncorrectImages}>Start</button>
        </div>
      )}
      {generatedImages.length > 0 && (
        <div>
          <h3>Select the correct image</h3>
          <div>
            {generatedImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Generated Option ${index}`}
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamiliarFaces;
