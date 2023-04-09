import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/esm/Col';
import axios from 'axios';

export default function CreateLeague() {
    const [users, setUsers] = useState([]);
    const [league, setLeague] = useState({
      _id: '',
      name: '',
      users: [],
      guesses: [],
      games: [],
      isPrivate: false,
    });
  
    const usersUrl = 'http://localhost:3100/api/users/';
  
    useEffect(() => {
      axios
        .get(usersUrl)
        .then((res) => {
          setUsers(res.data.map((user) => ({ ...user, isSelected: false })));
          //debug
          console.log(res.data);
        })
        .catch((err) => console.error(err));
    }, []);
  
    const handleNameChange = (event) => {
      setLeague({ ...league, name: event.target.value });
    };
  
    const handleCheckboxChange = (event) => {
      setLeague({ ...league, isPrivate: event.target.checked });
    };
  
    const handleUserSelection = (event) => {
      const selectedUserId = parseInt(event.target.value);
      const updatedUsers = users.map((user) =>
        user.id === selectedUserId ? { ...user, isSelected: event.target.checked } : user
      );
      setUsers(updatedUsers);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      const selectedUsers = users.filter((user) => user.isSelected);
  
      const data = {
        name: league.name,
        users: selectedUsers.map((user) => user.id),
        isPrivate: league.isPrivate,
      };
  
      axios
        .post('http://localhost:3100/api/leagues', data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    return (
      <Container>
        <Row>
          <h1>Create a League</h1>
        </Row>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formLeagueName">
                <Form.Label>League Name:</Form.Label>
                <Form.Control type="text" placeholder="Enter league's name" value={league.name} onChange={handleNameChange} />
              </Form.Group>
  
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Label>Type of league:</Form.Label>
                <Form.Check type="checkbox" label="Private" checked={league.isPrivate} onChange={handleCheckboxChange} />
              </Form.Group>
            </Col>
            <Col>
              <h1>Users available:</h1>
              {users.map((user) => (
                <Form.Group key={user.id} controlId={`user-${user.id}`}>
                  <Form.Check
                    type="checkbox"
                    label={user.fullName}
                    value={user.id}
                    checked={user.isSelected}
                    onChange={handleUserSelection}
                  />
                </Form.Group>
              ))}
            </Col>
          </Row>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    );
  }

/*export default function CreateLeague() {

    const [users, setUsers] = useState([]);

    const [league, setLeague] = useState({ _id: '', name: '', users: [], guesses: [], games: [], isPrivate: false});

    const usersUrl = "http://localhost:3100/api/users/";

    useEffect(() => {
        axios
          .get(usersUrl)
          .then((res) => {
            setUsers(res.data);
            //debug
            console.log(res.data);
          })
          .catch((err) => console.error(err));
      }, []);

      const handleSubmit = (event) => {
        event.preventDefault();
      
        const selectedUsers = users.filter((user) => user.isSelected);
      
        const data = {
          name: league.name,
          users: selectedUsers.map((user) => user.id),
          isPrivate: league.isPrivate,
        };
      
        axios
          .post('http://localhost:3100/api/leagues', data)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

  return (
    <Container>
        <Row>
         <h1>Create a League</h1>
        </Row>
            <Form onSubmit={handleSubmit}>
            <Row>
                <Col>
                <Form.Group className="mb-3" controlId="formLeagueName">
                <Form.Label>League Name:</Form.Label>
                <Form.Control type="text" placeholder="Enter league's name" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Label>Type of league:</Form.Label>
                    <Form.Check type="checkbox" label="Private" />
                    <Form.Check type="checkbox" label="Public" />
                </Form.Group>
                </Col>
                <Col>
                <h1>Users available:</h1>
                {users.map(user => (
                    <FormGroup key={user.id} controlId={`user-${user.id}`}>
                    <FormCheck type="checkbox" label={user.fullName} />
                    </FormGroup>
                ))}
                </Col>
                </Row>
            <Button variant="primary" type="submit">
                Submit
            </Button>

            </Form>


    </Container>

  )
}
*/