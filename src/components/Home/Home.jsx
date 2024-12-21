import React from "react";
import "./Home.css"; // Optional, for adding styles
import Navbar from "../NavBar/NavBar";

function Home() {
  return (
    <>
    <Navbar/>
    <div className="homepage-container">
      <header className="header">
        <h1>Welcome to Our Alzheimer's Awareness Page</h1>
      </header>

      <section className="content">
        <h2>What is Alzheimer's Disease?</h2>
        <p>
          Alzheimer's disease is a progressive neurological disorder that
          causes memory loss, confusion, and changes in behavior. It affects
          millions of people worldwide, primarily older adults, and is the
          most common cause of dementia.
        </p>

        <h2>Symptoms of Alzheimer's Disease</h2>
        <ul>
          <li>Memory loss that disrupts daily life</li>
          <li>Challenges in planning or solving problems</li>
          <li>Difficulty completing familiar tasks at home or work</li>
          <li>Confusion with time or place</li>
          <li>Changes in mood and personality</li>
        </ul>

        <h2>How Can We Help?</h2>
        <p>
          While there is no cure for Alzheimer's disease yet, early diagnosis and
          intervention can help manage symptoms and improve the quality of life
          for those affected. You can help raise awareness, volunteer, and support
          Alzheimer's research organizations to make a difference.
        </p>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Alzheimer's Awareness Organization</p>
      </footer>
    </div>
  
    </>
  );
    
}

export default Home;
