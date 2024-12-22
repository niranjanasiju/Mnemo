import React, { useState, useEffect } from "react";
import { db } from "/Users/niranjanasiju/mechanic3-story/Mnemo/firebase.js"; // Firebase imports
import { collection, query, where, getDocs } from "firebase/firestore";

const LifeSummaryAudio = () => {
  const [summary, setSummary] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Fetch the summary from Firebase based on some user identifier (e.g., userID)
  const fetchSummary = async () => {
    const q = query(collection(db, "lifeSummaries"), where("userId", "==", "USER_ID"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setSummary(doc.data().summary); // Assume each document has a "summary" field
    });
  };

  // Function to convert the summary to audio using Google Cloud Text-to-Speech
  const convertToAudio = async () => {
    if (!summary) {
      setFeedback("No summary available to convert.");
      return;
    }

    try {
      // Call OpenAI API to generate the summary (this step is optional if you're using Firebase to store pre-generated summaries)
      // const openai = new OpenAI({ apiKey: 'YOUR_OPENAI_API_KEY' }); // Uncomment this if you're generating summary on the fly
      // const response = await openai.completions.create({
      //   model: 'gpt-3.5-turbo',
      //   prompt: `Summarize the following text: ${summary}`,
      // });

      // Use Google Cloud Text-to-Speech API (or another TTS service)
      const response = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_GOOGLE_API_KEY`, // Replace with your Google API Key
        },
        body: JSON.stringify({
          input: {
            text: summary,
          },
          voice: {
            languageCode: "en-US",
            ssmlGender: "NEUTRAL", // Customize the voice here
          },
          audioConfig: {
            audioEncoding: "MP3", // Choose the audio format
          },
        }),
      });

      const data = await response.json();
      const audioContent = data.audioContent;

      // Convert the base64 audio content to a Blob and create an audio URL
      const audioBlob = new Blob([new Uint8Array(atob(audioContent).split("").map((c) => c.charCodeAt(0)))], {
        type: "audio/mp3",
      });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

      setFeedback("Audio generated successfully!");
    } catch (error) {
      console.error("Error generating audio:", error);
      setFeedback("Error generating audio. Please try again.");
    }
  };

  useEffect(() => {
    fetchSummary(); // Fetch the summary when the component loads
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Life Summary Audio</h1>
      <button onClick={convertToAudio}>Convert Summary to Audio</button>

      {feedback && <p>{feedback}</p>}

      {audioUrl && (
        <div>
          <p>Click below to listen to the summary:</p>
          <audio controls>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default LifeSummaryAudio;