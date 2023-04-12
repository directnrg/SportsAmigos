import React, { useState,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import jwt from 'jwt-decode'
import {useNavigate} from "react-router-dom";
import { Badge } from 'react-bootstrap';
import axios from 'axios';


export default function LeagueModalGrid({modalProps}) {
  const [weekGames, setWeekGames] = useState([]);


  const navigate = useNavigate();
  const [isGuessesDisabled, setIsGuessesDisabled] = useState(false);
  const onCheckStandings = (guessProps)=>{
    console.log("Modal props onCheckStandings", modalProps)

    console.log('/standings/'+modalProps.league._id);
    navigate('/standings/'+modalProps.league._id)
  }
  
  const onCreateGuesses = (guessProps)=>{
    console.log("Modal props onCreateGuesses", modalProps)
  
    console.log('/create-guesses/'+modalProps.league._id);
    navigate('/create-guesses/'+modalProps.league._id)
  }

  const gamesCurrentWeekUrl = 'http://localhost:3100/api/games-of-the-week';
  const gamesLastWeekUrl = 'http://localhost:3100/api/games-of-the-last-week';


  useEffect(()=>{
    axios
    .get(gamesLastWeekUrl)
    .then((res) => {
      console.log('res data', res.data.games);
      setWeekGames(res.data.games);
    })
    .catch((err) => console.error(err));

        console.log("Modal props",modalProps);

  },[]);

        console.log("Guesses length", modalProps?.league?.guesses?.length)
        if( modalProps?.league?.guesses?.length >0){
          setIsGuessesDisabled(true)
        } else {
          setIsGuessesDisabled(false);
        }

    });

  return (
    <Modal {...modalProps} aria-labelledby="contained-modal-title-vcenter" size="lg">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
        <h2 className='text-center'><Badge bg="dark"> League details</Badge></h2> 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          <Row>
            <Col xs={12} md={6}>
            <h2 className='text-center'><Badge bg="dark">  Name: {modalProps.league.name} </Badge></h2> 
            </Col>
        
          </Row>

          <Row>
           { /*<Col xs={6} md={4}>  <h2 className='text-center'><Badge bg="dark">   Games </Badge></h2>  </Col>*/}
           <h2 className='text-center'><Badge bg="dark">   Games </Badge></h2>
        
          </Row>
          <Row>
          <Table striped bordered hover variant="dark" className='text-center'>
            <thead>
              <tr>
                <th>Home</th>
                <th>Away</th>
                <th>Started</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
            { weekGames.map((game, index)=>{
              return(
              <tr  key={index}>
                <td>{game.homeTeam}</td>
                <td>{game.awayTeam}</td>
                <td>{game.startTime}</td>
                <td>{game.result}</td>
              </tr>)
            }) 
            }

            </tbody>

            
          </Table>
          </Row>

          <Row>
          <h2 className='text-center'><Badge bg="dark">   Guesses </Badge></h2>
           
        
          </Row>
          <Row>
          <Table striped bordered hover variant="dark" className='text-center'>
            <thead>
              <tr>
                <th>User</th>
                <th>Game</th>
                <th>Guess</th>
                <th>Points</th>
              </tr>
            </thead>
            
            <tbody>
            { modalProps?.league?.guesses?.map((guess, index)=>{
              return(
              <tr  key={index}>
                <td>{guess.user.fullName}</td>
                <td>{guess.game.homeTeam} vs {guess.game.awayTeam}</td>
                <td>{guess.guess}</td>
                <td>{guess.guessPoints}</td>
              </tr>)
            }) 
            }

            </tbody>

            
          </Table>
          </Row>

          <Row>
          <h2 className='text-center'><Badge bg="dark">   Users </Badge></h2>
        
          </Row>
          <Row>
          <Table striped bordered hover variant="dark" className='text-center'>
            <thead>
              <tr>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
            {console.log('users from props:' ,  modalProps?.league?.users)}
            { modalProps?.league?.users?.map((user, index)=>{
              return(
              <tr  key={index}>
                <td>{user.fullName}</td>
              </tr>)
            }) 
            }

            </tbody>

            
          </Table>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={modalProps.onHide}>Close</Button>
        <Button onClick={ ()=>{onCreateGuesses()}} disabled={isGuessesDisabled}>Create guesses</Button>
        <Button onClick={ ()=>{onCheckStandings()}}>Check Standings</Button>
      </Modal.Footer>
    </Modal>
  );
}



