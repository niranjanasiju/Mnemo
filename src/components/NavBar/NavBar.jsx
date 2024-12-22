import { BrowserRouter, Link, Route } from 'react-router-dom'; 
import './NavBar.css'
//import './GameNavigation'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Navbar = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Updated navigation function
    const auth = getAuth(); // Firebase authentication instance
    const provider = new GoogleAuthProvider(); // Google Auth Provider
  
    // Function to handle Google Sign-In
    const signInWithGoogle = async () => {
      setLoading(true);
      try {
        const result = await signInWithPopup(auth, provider);
  
        // Fetching user credentials
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
  
        console.log("User signed in:", user);
  
        // Call a function to store user data (optional, add `createDoc` if required)
        // createDoc(user);
  
        // Navigate to the dashboard after successful login
        navigate("/form");
      } catch (error) {
        console.error("Login failed:", error);
  
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email || "Unknown email";
        const credential = GoogleAuthProvider.credentialFromError(error);
  
        console.log(`Error details: ${errorCode}, ${errorMessage}, ${email}`, credential);
      } finally {
        setLoading(false);
      }
    };
  return (
    <div className="nav">
    <Link to="/" className="nav-logo">
      <img src="public/img/clown-fish.png" alt="logo" />
    </Link>
    <div className="nav-items">
      <Link to="/menue">
        <button className="nav-button">Menue</button>
      </Link>
      <button className="nav-button" onClick={signInWithGoogle}>
        {loading ? "Loading..." : "Login"}
      </button>
    </div>
  </div>
    
    );
}

export default Navbar;