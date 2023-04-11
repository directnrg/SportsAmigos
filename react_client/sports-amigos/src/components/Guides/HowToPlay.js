import React from 'react'
import ArticlesCarousel from './ArticlesCarousel.js'
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/esm/Col';
import Image from 'react-bootstrap/Image';

export default function HowToPlay() {
  return (
    <>
   <Container fluid>
      <Row className="justify-content-center align-items-center text-center">
        <h1>How to Play</h1>
      </Row>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} sm={6} lg={4} className="text-center">
          <Image src="/shawn.gif" alt="Image 1" className="img-fluid mb-4" />
          <h2>Step 1:</h2>
          <p>Create an account with your email.</p>
        </Col>
        <Col xs={12} sm={6} lg={4} className="text-center">
          <Image src="/soccer-leagues.jpg" alt="Image 2" className="img-fluid mb-4" />
          <h2>Step 2:</h2>
          <p>You're in! Checkout the list of Leagues available to you or create your own.</p>
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center text-center">
        <h1>Step 3:</h1>
      </Row>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} sm={6} lg={4} className="text-center">
          <Image src="/messi.webp" alt="Image 1" className="img-fluid mb-4" />
        </Col>
        <Col xs={12} sm={6} lg={4} className="text-center">
          <Image src="/kevin.jpg" alt="Image 2" className="img-fluid mb-4" />
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} sm={6} lg={4} className="text-center">
          <h2>Select an existing league:</h2>
          <p>Click the league you want to join!</p>
        </Col>
        <Col xs={12} sm={6} lg={4} className="text-center">
          <h2>Create a League:</h2>
          <p>Set the type, name and users that will play the league.</p>
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center text-center">
      <Col xs={12} sm={6} lg={4} className="text-center">
          <Image src="/bets.webp" alt="Image 2" className="img-fluid mb-4" />
          <h2>Set your guesses...</h2>
          <p>Select the result of each game on the weekly pool. <strong>REMEMBER</strong>, your decision will be final!</p>
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center text-center">
      <Col xs={12} sm={6} lg={4} className="text-center">
          <Image src="/champion.jpg" alt="Image 2" className="img-fluid mb-4" />
          <h2>Keep the score and get more points!</h2>
          <p>Play each week with your friends until a Champion is crowded!</p>
        </Col>
      </Row>
    </Container>
    
    <ArticlesCarousel/>

    </>
  )
}
