import React from "react";
import "./Home.css"; // Optional, for adding styles
import Navbar from "../NavBar/NavBar";

function Home() {
  return (
    <>
      <div>
        <Navbar />
        </div>
    <div className="homepage-container">
      <header className="header">
        <h1>Welcome to MNEMO</h1>
      </header>

      <section className="content">
        <h2>Rediscover Connection. Rekindle Memories.</h2>
        <p>
        At the heart of every meaningful relationship is the power of shared memories. But for those living with Alzheimer’s and other memory-related conditions, those precious moments can fade, leaving individuals feeling isolated from themselves and their loved ones.
          </p>
          <p>What if there was a way to reconnect, not just with the past, but with the present and future? Welcome to MemoCare, an innovative memory-boosting game designed to bring comfort and joy to individuals facing memory loss.</p>

          <p>By blending personal experiences, family input, and advanced AI, MemoCare offers a unique, customized journey that helps users rediscover lost connections, relive cherished moments, and nurture meaningful relationships—one game at a time. This is more than just a game; it’s a bridge between technology and heart, a light in the darkness of memory loss.</p>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Alzheimer's Awareness Organization</p>
      </footer>
    </div>
  
    </>
  );
    
}

export default Home;
