import './styles/App.css';
import {Route,Routes, Link} from "react-router-dom";
import {React,useEffect, useState} from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Home from './components/Home';
import SignUp from './components/SignUp';
import HowToPlay from './components/Guides/HowToPlay';
import Button from 'react-bootstrap/Button';
import Login from './components/Login';
import Footer from './components/Footer';
import LeagueList from './components/Leagues/LeagueList';
import MyLeagues from './components/Leagues/MyLeagues';
import LeagueStandings from './components/Leagues/LeagueStandings';
import Article from './components/Guides/Article';

function SportsAmigosApp() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginToggle = ()=>{
    setIsLoggedIn(!isLoggedIn)

  }

  useEffect(() => {
    document.title = 'Sports Pool';
  }, []);

  //Display if the user has logged in
  if(isLoggedIn){
    return (
    
      <> 
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand  as={Link} to="/">Sports Amigos</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link}  to="/guides">Guides</Nav.Link>
              <Nav.Link as={Link}  to="/league-list">League List</Nav.Link>
              <Nav.Link as={Link}  to="/my-leagues">My Leagues</Nav.Link>
              <Button as={Link}  to="/" onClick={loginToggle} >Log Out</Button>{' '}
             
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
        <div>
          <Routes>
            <Route index element={<Home/>} />
            <Route path="sign-up" element={<SignUp/>} />   
            <Route path="/guides/" element={<HowToPlay />}/>
            <Route path="/guides/article/:id" element={<Article/>}/>
            <Route path="/log-in" element={<Login/>} /> 
            <Route path="/league-list" element={<LeagueList/>} />  
            <Route path="/my-leagues" element={<MyLeagues/>} />          
            
            {/*Add the route to your component if necessary */}
          </Routes>
        </div>
  
        <Footer></Footer>
  
       
        </>
  
      
    );

  }
  else{
    return (
    
      <>
      
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand  as={Link} to="/">Sports Amigos</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link}  to="/guides">Guides</Nav.Link>
              <Button as={Link}  to="/sign-up">Sign up</Button>{' '}
              <Button onClick={loginToggle}  >Log in</Button>
              
             
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
        <div>
          <Routes>
            <Route index element={<Home/>} />
            <Route path="sign-up" element={<SignUp/>} />   
            <Route path="/guides/" element={<HowToPlay />}/>
            <Route path="/guides/article/:id" element={<Article/>}/>          
            <Route path="/log-in" element={<Login/>} /> 
            
            {/*Add the route to your component if necessary */}
          </Routes>
        </div>
  
        <Footer></Footer>
  
       
        </>
  
      
    );
  }

}

export default SportsAmigosApp;
