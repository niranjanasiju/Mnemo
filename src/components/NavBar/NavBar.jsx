import { Link } from 'react-router-dom'; 
import './NavBar.css'
import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
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
        <div className='nav'>
      
            <Link to="/"><div className='home'>Home</div></Link>
            <Link to="/menue"><div>Menue</div></Link>
            <Link to="/login" onClick={signInWithGoogle}><div>Login</div></Link>
          </div>
          
          
            
          );
      
}

export default Navbar;