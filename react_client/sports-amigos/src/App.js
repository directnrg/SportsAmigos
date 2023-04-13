import './styles/App.css';
import { Route, Routes, Link } from "react-router-dom";
import { React, useEffect, useState, createContext } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Home from './components/Home';
import SignUp from './components/SignUp';
import HowToPlay from './components/Guides/HowToPlay';
import Button from 'react-bootstrap/Button';
import Footer from './components/Footer';
import LeagueList from './components/Leagues/LeagueList';
import MyLeagues from './components/Leagues/MyLeagues';
import Article from './components/Guides/Article';
import LoginModal from './components/LoginModal';
import { faL } from '@fortawesome/free-solid-svg-icons';
import CreateLeague from './components/Leagues/CreateLeague';
import CreateGuesses from './components/Leagues/CreateGuesses';
import jwt from 'jwt-decode'
import Standings from './components/Leagues/Standings';


export const MyContext = createContext()

function SportsAmigosApp() {

  //Hooks and states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginModalShow, setLoginModalShow] = useState(false);
  const [loginData, setLoginData] = useState({login:false});
  const [loggedId, setLoggedId] = useState({});


  //Context props
  const modalProps = {
    show: loginModalShow,
    onHide: () => setLoginModalShow(false),
  }

  //Callbacks and methods

  //Open modal onLogin
  const onLogin = () => {
    setLoginModalShow(true)

  }

  //Reset states on logout
  const onLogout=()=>{
    sessionStorage.clear();
    setLoginData({login:false});

  }

  //Runs once when component is rendered first time
  useEffect(() => {
    document.title = 'Sports Pool'; //Changing page title
    if(sessionStorage.getItem("login")!==null){ //checking if jwt exist and set state's context
      
      const token = JSON.parse(sessionStorage.getItem("login"));
      const decodedToken = jwt(token.token);
      const userId = decodedToken.user.id;

      //Storing data in the context
      setLoginData({ login: true, userId: userId });

    }
   
  }, []);

  useEffect(() => {
    console.log("Login Data:",loginData)
  });

  //Display if the user has logged in
  if (loginData.login) {
    return (

      <>
        <MyContext.Provider value={{  loginData, setLoginData}}>

          <Navbar bg="light" expand="lg">
            <Container>
              <Navbar.Brand as={Link} to="/">Sports Amigos</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">Home</Nav.Link>
                  <Nav.Link as={Link} to="/guides">Guides</Nav.Link>
                  <Nav.Link as={Link} to="/create-league">Create a League</Nav.Link>
                  <Nav.Link as={Link} to="/league-list">League List</Nav.Link>
                  <Nav.Link as={Link} to="/my-leagues">My Leagues</Nav.Link>
                  <Button as={Link} to="/" onClick={onLogout} >Log Out</Button>{' '}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <div>
            <Routes>
              <Route index element={<Home />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="/guides/" element={<HowToPlay />} />
              <Route path="/guides/article/:id" element={<Article />} />
              <Route path="/league-list" element={<LeagueList />} />
              <Route path="/standings/:id" element={<Standings />} />
              <Route path="/my-leagues" element={<MyLeagues />} />
              <Route path='/create-league' element={<CreateLeague />} />
              <Route path='/create-guesses/:id' element={<CreateGuesses />} />

              {/*Add the route to your component if necessary */}
            </Routes>
          </div>

          <Footer></Footer>
        </MyContext.Provider>



      </>
    );

  }

  //Display if the user is not logged in
  else {
    return (

      <>
       <MyContext.Provider value={{loginData, setLoginData }}>

        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">Sports Amigos</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/guides">Guides</Nav.Link>
                <Button as={Link} to="/sign-up">Sign up</Button>{' '}
                <Button onClick={onLogin}  >Log in</Button>
                <LoginModal modalProps={modalProps} />



              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div>
          <Routes>
            <Route index element={<Home />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="/guides/" element={<HowToPlay />} />
            <Route path="/guides/article/:id" element={<Article />} />
            

            {/*Add the route to your component if necessary */}
          </Routes>


        </div>

        <Footer></Footer>

        </MyContext.Provider>
      </>


    );
  }

}

export default SportsAmigosApp;
