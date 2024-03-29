import React, { useState, useEffect, useRef, useContext } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import jwt from "jwt-decode";
import { MyContext } from "../App";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput,
} from "mdb-react-ui-kit";
import { httpService } from "../services/service";
import { validation } from "../services/validation";

export default function LoginModal({ modalProps }) {
  //Constants
  const URL = "http://localhost:3100/api";

  //States

  const [loginErrorMsgs, setLoginErrorMsg] = useState([]);

  //Hooks
  const emailRef = useRef();
  const passwordRef = useRef();
  const { loginData, setLoginData } = useContext(MyContext);

  //Callbacks

  //validate form, display errors and send data to backend
  const onLogin = async () => {
    console.log("Login Clicked");
    let canPost = true;
    let valErrors = [];
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    console.log("email:", email);
    console.log("password:", password);

    //Validating
    if (!validation.password.test(password)) {
      valErrors.push(
        "The password should not be null,  contain any spaces, and should have at least one number and special character"
      );
      canPost = false;
    }

    if (!validation.email.test(email)) {
      valErrors.push("The email is not a valid email string form");
      console.log(valErrors);
      canPost = false;
    }

    console.log(canPost);

    if (!sessionStorage.getItem("login")) {
      const user = {
        email: email,
        password: password,
      };

      //calling API
      try {
        console.log("Authenticating");
        const res = await httpService.post(URL + "/auth", user);

        if (res.response?.status !== 400) {
          //Storing token in session storage
          sessionStorage.setItem(
            "login",
            JSON.stringify({
              login: true,
              token: res.token,
            })
          );

          //Decoding and storing jwt token
          const token = JSON.parse(sessionStorage.getItem("login"));
          const decodedToken = jwt(token.token);
          const userId = decodedToken.user.id;

          //Storing data in the context
          setLoginData({ login: true, userId: userId });
          modalProps.onHide();
        } else {
          valErrors.push(res.response.data.msg);
        }
      } catch (e) {
        console.log(e.message);
      }
    }

    //Set error state
    setLoginErrorMsg(valErrors);
  };
  useEffect(() => {
    console.log("Modal props", modalProps);
    console.log("Session data", sessionStorage.getItem("login"));
  });

  useEffect(() => {
    //Setting errors to null each time the component is rendered the first time
    setLoginErrorMsg([]);
  }, []);
  return (
    <Modal {...modalProps} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body className="show-grid">
        <Container>
          <MDBRow>
            <MDBCol col="6">
              <MDBInput
                ref={emailRef}
                wrapperClass="mb-4"
                label="Email"
                id="email"
                type="text"
              />
            </MDBCol>
            <MDBCol col="6">
              <MDBInput
                ref={passwordRef}
                wrapperClass="mb-4"
                label="Password"
                id="password"
                type="password"
              />
            </MDBCol>
          </MDBRow>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={modalProps.onHide}>Cancel</Button>
        <Button onClick={onLogin}>Login</Button>

        {loginErrorMsgs.length > 0
          ? loginErrorMsgs.map((msg, index) => (
              <Alert key={index} variant={"danger"}>
                {" "}
                {msg}
              </Alert>
            ))
          : null}
      </Modal.Footer>
    </Modal>
  );
}
