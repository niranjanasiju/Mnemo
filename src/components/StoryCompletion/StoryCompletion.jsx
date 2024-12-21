import React, { useState, useEffect } from "react";
import axios from "axios"; // For API calls
import { getDatabase, ref, get } from "firebase/database"; // Firebase imports

const StoryCompletion = () => {
  const [userData, setUserData] = useState(null);
  const [story, setStory] = useState("");
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const API_URL = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it";
  const API_TOKEN = "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"; // Replace with your token

  // Define the query function
  const query = async (prompt) => {
    try {
      const response = await axios.post(API_URL, prompt, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      return response.data; // Return the data from the response
    } catch (error) {
      console.error("API call error:", error);
      throw error; // Rethrow the error
    }
  };

  // Sample user data
  const sampleUserData = {
    name: "John Doe",
    familyMember: "sister",
    hobby: "painting",
    nativePlace: "New York"
  };

  useEffect(() => {
    // Set sample user data instead of fetching from Firebase
    setUserData(sampleUserData);
  }, []);

  useEffect(() => {
    if (userData) {
      console.log("User Data:", userData);
  
      const generateStory = async () => {
        const prompt = {
          inputs: `Create a 50-word story based on the following details: 
          Name: ${userData.name}, 
          Family Member: ${userData.familyMember}, 
          Hobby: ${userData.hobby}, 
          Native Place: ${userData.nativePlace}. 
          Include a blank space in the story for the user to fill in. Provide three options to choose from, with one option being the correct answer that fills the blank. Generate output in the following format without any additional text or formatting:
          
          Example:
          if the user details are
          Name: John Doe, 
          Family Member: sister, 
          Hobby: painting, 
          Native Place: New York 
          
          {Story:John Doe, a proud New Yorker, loved painting vibrant cityscapes. One day, he and his sister went to Central Park, where he painted a stunning view of the lake. The artwork captured the essence of _______ so beautifully that even strangers stopped to admire it.,Option 1:serenity,Option 2:chaos,Option 3:mystery,Answer: Option 1}
          
          Now, create a story based on the details provided above.`
        };
  
        try {
          const result = await query(prompt);
          console.log("API Response:", JSON.stringify(result, null, 2));
  
          if (result && result.length > 0 && result[0]?.generated_text) {
            const generatedText = result[0].generated_text;
            console.log("Generated Text:", generatedText);
  
            // Updated parsing logic
            const matches = generatedText.match(
              /{Story:\s*([\s\S]*?),\s*Option 1:\s*(.*?),\s*Option 2:\s*(.*?),\s*Option 3:\s*(.*?),\s*Answer:\s*(.*)}/
            );
  
            if (matches && matches.length === 6) {
              const parsedOutput = {
                Story: matches[1].trim(),
                Option1: matches[2].trim(),
                Option2: matches[3].trim(),
                Option3: matches[4].trim(),
                Answer: matches[5].trim()
              };
  
              console.log("Parsed Output:", parsedOutput);
              setStory(parsedOutput.Story);
              setOptions([parsedOutput.Option1, parsedOutput.Option2, parsedOutput.Option3]);
              setCorrectOption(parsedOutput.Answer);
            } else {
              setFeedback("Failed to parse the generated response. Please try again.");
            }
          } else {
            setFeedback("No story generated. Please try again.");
          }
        } catch (error) {
          console.error("Error generating story:", error);
          setFeedback("Failed to generate story. Please check the console for details.");
        }
      };
  
      generateStory();
    }
  }, [userData]);
  

  const handleAnswerSubmit = () => {
    if (userAnswer === options[0]) {
      setFeedback("Correct!");
    } else {
      setFeedback("Try again!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Story Completion Game</h1>
      {userData && story ? (
        <>
          <p>{story}</p>
          <div>
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => setUserAnswer(option)}
                style={{
                  margin: "5px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  background: userAnswer === option ? "#ddd" : "#fff",
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <button onClick={handleAnswerSubmit} style={{ marginTop: "10px" }}>
            Submit Answer
          </button>
          {feedback && <p>{feedback}</p>}
        </>
      ) : (
        <p>Loading game...</p>
      )}
    </div>
  );
};

export default StoryCompletion;