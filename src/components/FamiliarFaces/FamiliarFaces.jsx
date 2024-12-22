import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebase";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import "../../components/FamiliarFaces/FamiliarFaces.css";
import Navbar from "../NavBar/NavBar";
const FamiliarFaces = () => {
  const [randomImage, setRandomImage] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalTries, setTotalTries] = useState(0);
  const [message, setMessage] = useState("");
  const fetchInitialScore = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const gameRef = doc(db, "users", user.uid, "game4", "score");
      const gameDoc = await getDoc(gameRef);

      if (gameDoc.exists()) {
        const { score } = gameDoc.data();
        const [correct, total] = score.split("/").map(Number);
        setCorrectAnswers(correct);
        setTotalTries(total);
      }
    } catch (error) {
      console.error("Error fetching initial score:", error);
    }
  };

  const fetchRandomImage = async () => {
    setLoading(true);
    setMessage("");
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

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  };

  const generateIncorrectImages = async () => {
    if (!randomImage) return;

    setLoading(true);
    setGeneratedImages([]);
    try {
      const newImages = [randomImage.base64];
      const incorrectVariants = Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * 100) + 1
      );
      console.log(randomImage);
      for (const variant of incorrectVariants) {
        const prompt = `A realistic face of a human ${randomImage.relation}, variant ${variant}`;
        const imageUrl = await query(prompt);
        newImages.push(imageUrl);
      }

      setGeneratedImages(newImages.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error("Error generating incorrect images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = async (image) => {
    setTotalTries((prev) => prev + 1);
    let isCorrect = false;

    if (image === randomImage.base64) {
      setMessage("Correct! Well done.");
      setCorrectAnswers((prev) => prev + 1);
      isCorrect = true;
    } else {
      setMessage("Incorrect! Try again.");
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const gameRef = doc(db, "users", user.uid, "game4", "score");
      await setDoc(
        gameRef,
        {
          score: `${correctAnswers + (isCorrect ? 1 : 0)}/${totalTries + 1}`,
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error updating score:", error);
    }

    fetchRandomImage();
    setGeneratedImages([]);

    // Hide message after 5 seconds
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  useEffect(() => {
    fetchRandomImage();
    fetchInitialScore();
  }, []);

  return (
    <>
    <Navbar/>
    <div className="familiar-faces-container">
        <div className="top">
            <h1>Familiar Faces</h1>
        </div>
      
      <h2>Score: {correctAnswers}/{totalTries}</h2>
      {loading && <p>Loading...</p>}
      {message && (
        <p className={message.startsWith("Correct") ? "message-correct" : "message-incorrect"}>
          {message}
        </p>
      )}
      {randomImage && (
        <div>
          <h3>{randomImage.tagName}</h3>
          <button onClick={generateIncorrectImages} className="start-button">
            Play
          </button>
        </div>
      )}
      {generatedImages.length > 0 && (
        <div>
          <h3>Do you see a familiar face? hint: your {randomImage.relation} </h3>
          <div className="image-grid">
            {generatedImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Generated Option ${index}`}
                onClick={() => handleImageClick(img)}
                className="grid-image"
              />
            ))}
          </div>
        </div>
      )}
    </div>
    </>
    
  );
};

export default FamiliarFaces;
