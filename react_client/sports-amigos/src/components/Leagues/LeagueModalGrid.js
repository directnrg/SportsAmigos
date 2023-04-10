import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import jwt from 'jwt-decode'


export default function LeagueModalGrid({modalProps}) {

    const onCreateGuess = (guessProps)=>{

    }
    useEffect(()=>{
        console.log("Modal props",modalProps);
    });
  return (
    <Modal {...modalProps} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
         League details:
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          <Row>
            <Col xs={12} md={6}>
             Name: {modalProps.league.name}
            </Col>
        
          </Row>

          <Row>
            <Col xs={6} md={4}>Games: </Col>
        
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
            { modalProps?.league?.games?.map((game, index)=>{
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
            <Col xs={6} md={4}>Guesses: </Col>
        
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
                <td>{guess.userPoints}</td>
              </tr>)
            }) 
            }

            </tbody>

            
          </Table>
          </Row>

          <Row>
            <Col xs={6} md={4}>Users: </Col>
        
          </Row>
          <Row>
          <Table striped bordered hover variant="dark" className='text-center'>
            <thead>
              <tr>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
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
        <Button onClick={modalProps.onHide}>Create guesses</Button>
      </Modal.Footer>
    </Modal>
  );
}



