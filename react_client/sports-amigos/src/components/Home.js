import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";

export default function Home() {
  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center text-center">
        <h1>Welcome to Sports Amigos!</h1>
      </Row>
      <Row className="justify-content-center align-items-center text-center">
        <p>We're happy to present this brand new application where you can create a sports pool with your friends! Compete each week to get points and be at top of the table!</p>
      </Row>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} sm={6} lg={4} className="text-center">
          <img src="/haaland.webp" alt="Image 1" className="img-fluid mb-4" />
          <h2>How to Play</h2>
          <p>Click in here to learn how to use the application.</p>
          <Button variant="primary"href='/guides'>How to Play</Button>
        </Col>
        <Col xs={12} sm={6} lg={4} className="text-center">
          <img src="/unam.webp" alt="Image 2" className="img-fluid mb-4" />
          <h2>Register</h2>
          <p>Click here to create an account.</p>
          <Button variant="secondary" href='/sign-up'>Register</Button>
        </Col>
      </Row>
    </Container>
  );
}