import React, { useState,useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput,
}
  from 'mdb-react-ui-kit';

import {httpService} from '../services/service';
import {validation} from '../services/validation';

export default function LoginModal({modalProps}) {
  const URL = 'http://localhost:3100/api'


  const { emailRef, passwordRef} = useRef();
  
    const onLogin = async()=>{
      try{
      const res = await httpService.get(URL,{});
      console.log('Leagues:',res)
  
      }
      catch(e){
        console.log(e.message)
      }

    }
    useEffect(()=>{
        console.log("Modal props",modalProps);
    });
  return (
    <Modal {...modalProps} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
         Login
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
        <MDBRow>
            <MDBCol col='6'>
              <MDBInput ref= {emailRef} wrapperClass='mb-4' label='Email' id='email' type='text' />
            </MDBCol>
            <MDBCol col='6'>
              <MDBInput ref= {passwordRef} wrapperClass='mb-4' label='Password' id='password' type='password' />
            </MDBCol>

          </MDBRow>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={modalProps.onHide}>Cancel</Button>
        <Button onClick={onLogin}>Login</Button>
      </Modal.Footer>
    </Modal>
  );
}



