import { Link } from 'react-router-dom'; 
import './NavBar.css'

const Navbar = () => {
  return (
      <div className='nav'>
      
       <Link to="/"><div className='home'>Home</div></Link>
        <Link to="/login"><div >Login</div></Link>
        </div>
      
    );
}

export default Navbar;