import React, { useState } from "react";

function Incorrect() {
  const [prompt, setPrompt] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Function to call Hugging Face API
  async function GetIncorrrectOptions(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium-diffusers",
      {
        headers: {
          Authorization: "Bearer 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", // Replace with your Hugging Face API key
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate image.");
    }

    const result = await response.blob();
    return result;
  }

  // Delay function
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Function to generate three unique images based on the prompt
  const generateImages = async () => {
    if (prompt.trim() === "") return;

    setLoading(true);
    setImageUrls([]); // Reset image URLs
    setError(null); // Reset error message

    try {
      const generatedImages = [];
      const variants = ["variant 1", "variant 2", "variant 3"];

      for (let i = 0; i < 3; i++) {
        const modifiedPrompt = `${prompt} (${variants[i]})`; // Add unique variant to the prompt
        const response = await GetIncorrrectOptions({ inputs: modifiedPrompt });
        const imageUrl = URL.createObjectURL(response);
        generatedImages.push(imageUrl);
        await delay(1000); // Add a 1-second delay between API calls
      }

      setImageUrls(generatedImages);
    } catch (error) {
      console.error("Error generating images:", error);
      setError("Failed to generate images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10">
      <h1 className="text-4xl font-bold mb-8">AI Image Generator</h1>

      <input
        type="text"
        className="p-2 border-2 border-gray-300 rounded-md w-1/2 mb-4"
        placeholder="Enter a prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white py-2 px-6 rounded-lg mt-4"
        onClick={generateImages}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Images"}
      </button>

      {loading && <p className="mt-4 text-lg">Loading...</p>}

      {error && <p className="mt-4 text-lg text-red-500">{error}</p>}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={url}
              alt={`Generated ${index + 1}`}
              className="w-full max-w-xs rounded-lg"
              loading="lazy"
            />
            <button
              className="bg-green-500 text-white py-1 px-4 rounded-lg mt-4"
              onClick={() => {
                const link = document.createElement("a");
                link.href = url;
                link.download = `generated-image-${index + 1}.jpg`;
                link.click();
              }}
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export {GetIncorrrectOptions};
