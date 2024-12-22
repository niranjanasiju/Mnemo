import React, { useState, useEffect, useRef } from "react";
import { OpenAI } from "openai"; // Import OpenAI directly from the openai package
import { db } from "/Users/niranjanasiju/mechanic3-story/old/firebase.js"; // Firebase imports
import { collection, addDoc } from "firebase/firestore";

const LifeSummary = () => {
  const [audioData, setAudioData] = useState(null);
  const [summary, setSummary] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState("");

  const mediaRecorderRef = useRef(null); // To store the media recorder instance
  const audioChunksRef = useRef([]); // To store recorded audio chunks

  const openai = new OpenAI({
    //apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Replace with your OpenAI API key
    apiKey: "xxx",
    dangerouslyAllowBrowser: true, // Bypass the restriction for browser environments
  });

  // Function to start and stop the recording
  const toggleRecording = async () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          setAudioData(audioBlob);
        };

        mediaRecorderRef.current.start();
      } catch (err) {
        console.error("Error accessing audio input:", err);
        setFeedback("Error accessing microphone.");
      }
    } else {
      // Stop recording
      setIsRecording(false);
      mediaRecorderRef.current.stop();
    }
  };

  // Function to convert audio to text and summarize it
  const processAudio = async (audioData) => {
    try {
      const formData = new FormData();
      formData.append("file", audioData);
      formData.append("model", "whisper-1"); // Use OpenAI's Whisper model for audio-to-text

      // Send audio file to OpenAI Whisper API for transcription
      const transcriptResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openai.apiKey}`,
        },
        body: formData,
      });

      const transcript = await transcriptResponse.json();
      const text = transcript.text;

      // Now summarize the transcript using GPT-3 or another OpenAI model
      const summaryResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Summarize the following text: ${text}`, // Removed "autobiography" from the prompt
          },
        ],
      });

      const summaryText = summaryResponse.choices[0].message.content;
      setSummary(summaryText);
      console.log("Summarized Text:", summaryText); // Log the summary in the console

      // Save the summary to Firebase DB
      await addDoc(collection(db, "lifeSummaries"), {
        summary: summaryText,
        timestamp: new Date(),
      });

      setFeedback("Summary saved successfully!");
    } catch (error) {
      console.error("Error processing audio:", error);
      setFeedback("Error processing the audio. Please try again.");
    }
  };

  useEffect(() => {
    if (audioData) {
      processAudio(audioData);
    }
  }, [audioData]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Life Summary</h1>
      <button onClick={toggleRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {summary && <p><strong>Summary:</strong> {summary}</p>}
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default LifeSummary;