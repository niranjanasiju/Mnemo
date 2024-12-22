import React, { useState, useEffect } from "react";
import { OpenAI } from "openai";
import { doc, getDoc } from "firebase/firestore"; // Firebase Firestore imports
import { db } from "/Users/niranjanasiju/mechanic3-story/Mnemo/firebase.js";

const StoryCompletion = () => {
  const [userData, setUserData] = useState(null); // Store user data from Firestore
  const [story, setStory] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  //const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // Replace with your OpenAI API key
  const OPENAI_API_KEY = "xxx";

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // Enable browser usage
  });

  // Function to fetch user data from Firestore
  const fetchUserDataFromFirestore = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        console.log("Fetched User Data:", docSnap.data());
        return docSnap.data();
      } else {
        console.warn("No such user found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const fetchedUserData = await fetchUserDataFromFirestore("zXss39oOyyahfiDIjm1yF0TFhhg2");
      if (fetchedUserData) {
        setUserData(fetchedUserData);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (userData) {
      const generateStory = async () => {
        const prompt = `
          You are a creative writer and game designer. Based on the given data:
          Name: ${userData.name || "unknown"}, 
          Family Member: ${userData.familyMember || "unknown"}, 
          Hobby: ${userData.hobby || "unknown"}, 
          Native Place: ${userData.nativePlace || "unknown"}.
          Write a story of no more than 50 words. Create a fill-in-the-blank question with three options.
          Return the output in this format:
          {
            "story": "Your story", 
            "question": "Your question", 
            "o1": "Option A", 
            "o2": "Option B", 
            "o3": "Option C", 
            "correct_ans": "Correct Option"
          }
        `;

        try {
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
          });

          const generatedText = response.choices[0].message.content.trim();
          console.log("Generated Text:", generatedText);

          // Safely parse the JSON response
          try {
            const parsed = JSON.parse(generatedText);

            if (
              parsed &&
              parsed.story &&
              parsed.question &&
              parsed.o1 &&
              parsed.o2 &&
              parsed.o3 &&
              parsed.correct_ans
            ) {
              setStory(parsed.story);
              setQuestion(parsed.question);
              setOptions([parsed.o1, parsed.o2, parsed.o3]);
              setCorrectOption(parsed.correct_ans);
            } else {
              throw new Error("Incomplete or malformed response");
            }
          } catch (parseError) {
            console.error("Error parsing the generated response:", parseError);
            setFeedback("Failed to parse the story. Please try again.");
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
    if (userAnswer === correctOption) {
      setFeedback("Correct! 🎉");
    } else {
      setFeedback("Try again! ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Story Completion Game</h1>
      {story ? (
        <>
          <p><strong>Story:</strong> {story}</p>
          <p><strong>Question:</strong> {question}</p>
          <div>
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => setUserAnswer(option)}
                style={{
                  margin: "5px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  background: userAnswer === option ? "#e0f7fa" : "#fff",
                  cursor: "pointer",
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleAnswerSubmit}
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit Answer
          </button>
          {feedback && (
            <p style={{ marginTop: "10px", color: feedback.includes("Correct") ? "green" : "red" }}>
              {feedback}
            </p>
          )}
        </>
      ) : (
        <p>Loading game...</p>
      )}
    </div>
  );
};

export default StoryCompletion;

