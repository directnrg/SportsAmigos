import React, { useState, useEffect, useContext } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/esm/Col';
import axios from 'axios';
import { MyContext } from '../../App';
import {useNavigate} from 'react-router-dom';

export default function CreateLeague() {

    const navigate = useNavigate();
    const { loginData, setLoginData } = useContext(MyContext);
    const [users, setUsers] = useState([]);
    const [weekGames, setWeekGames] = useState([]);
    const [league, setLeague] = useState({
      _id: '',
      name: '',
      users: [],
      guesses: [],
      games: [],
      isPrivate: false,
    });
  
    const usersUrl = 'http://localhost:3100/api/users/';
    const gamesUrl = 'http://localhost:3100/api/games-of-the-week/';
  
    useEffect(() => {
      axios
        .get(usersUrl)
        .then((res) => {
          const usersWithSelection = res.data.map((user) => ({
            ...user,
            isSelected: user._id === loginData.userId, // Set isSelected to true if user id matches the logged in user id
          }));
          setUsers(usersWithSelection);
          //debug
          console.log(usersWithSelection);
        })
        .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
      axios
      .get(gamesUrl)
      .then((res) => {
        const gameIds = res.data.games.map((game) => game._id);
        console.log('gameids', gameIds);
        setWeekGames(gameIds);
      })
      .catch((err) => console.error(err));
    }, []);

    const createLeague = async() => {
      let leagueTest = null;

      const selectedUsers = users.filter((user) => user.isSelected);
  
      const data = {
        name: league.name,
        users: selectedUsers.map((user) => user._id),
        isPrivate: league.isPrivate,
        games: weekGames,
      };
      try {
        const response = await axios.post('http://localhost:3100/api/league', data);
        console.log("DATA POST", response.data);
        leagueTest = response.data;
        return leagueTest;
      }
      catch(e) {
        console.log(e.message);

      }

    }
  
    const handleNameChange = (event) => {
      setLeague({ ...league, name: event.target.value });
    };
  
    const handleCheckboxChange = (event) => {
      setLeague({ ...league, isPrivate: event.target.checked });
    };
  
    const handleUserSelection = (event) => {
      const selectedUserId = event.target.value;
      const updatedUsers = users.map((user) =>
        user._id === selectedUserId ? { ...user, isSelected: event.target.checked } : user
      );
      setUsers(updatedUsers);
    };

    const handleSubmit = async(event) => {
      event.preventDefault();

      const leagueCreated = await createLeague();


     console.log("como la chu", leagueCreated);
  
   /*   axios
        .post('http://localhost:3100/api/league', data)
        .then((response) => {
          console.log("DATA POST", response.data);
        })
        .catch((error) => {
          console.log(error);
        }); */


        navigate('/my-leagues');
      
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
                <Form.Group key={user._id} controlId={`user-${user._id}`}>
                  <Form.Check
                    type="checkbox"
                    label={user.fullName}
                    value={user._id}
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
