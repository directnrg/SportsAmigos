import './styles/App.css';
import {Route,Routes, Link} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Home from './components/Home';
import SignUp from './components/SignUp';
import HowToPlay from './components/HowToPlay';
import Button from 'react-bootstrap/Button';
import Login from './components/Login';

function SportsAmigosApp() {
  return (
    
    <>
    
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand  as={Link} to="/">Sports Amigos</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link}  to="/how-to-play">HowToPlay</Nav.Link>
            <Button as={Link}  to="/sign-up">Sign up</Button>{' '}
            <Button as={Link}  to="/log-in">Log in</Button>{' '}
           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
      <div>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="sign-up" element={<SignUp/>} />   
          <Route path="/how-to-play" element={<HowToPlay/>} />  
          <Route path="/log-in" element={<Login/>} /> 
          
          {/*Add the route to your component if necessary */}
        </Routes>
      </div>
      </>

    
  );
}

export default SportsAmigosApp;
