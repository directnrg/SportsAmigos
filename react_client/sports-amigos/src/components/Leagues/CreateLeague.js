import React, { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/esm/Col";
import axios from "axios";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";

export default function CreateLeague() {
  // Const, States and Context
  const navigate = useNavigate();
  const { loginData, setLoginData } = useContext(MyContext);
  const [users, setUsers] = useState([]);
  const [weekGames, setWeekGames] = useState([]);
  // League is set it up since beginning so it can be populated
  const [league, setLeague] = useState({
    _id: "",
    name: "",
    users: [],
    guesses: [],
    games: [],
    isPrivate: false,
  });

  // URLs for the Axios Calls
  const usersUrl = "http://localhost:3100/api/users/";
  const gamesCurrentWeekUrl = "http://localhost:3100/api/games-of-the-week/";
  //const gamesLastWeekUrl = "http://localhost:3100/api/games-of-the-last-week";

  useEffect(() => {
    axios
      .get(usersUrl)
      .then((res) => {
        const usersWithSelection = res.data.map((user) => ({
          ...user,
          isSelected: user._id === loginData.userId, // Set isSelected to true if user id matches the logged in user id
        }));
        setUsers(usersWithSelection); //Users set it up according to the checkboxes
        //debug
        console.log(usersWithSelection);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get(gamesCurrentWeekUrl) // Games that are going to be saved in the league
      .then((res) => {
        const gameIds = res.data.games.map((game) => game._id);
        console.log("gameids", gameIds);
        setWeekGames(gameIds);
      })
      .catch((err) => console.error(err));
  }, []);

  // Method to create the league
  const createLeague = async () => {
    let leagueTest = null;

    const selectedUsers = users.filter((user) => user.isSelected);

    const data = {
      name: league.name,
      users: selectedUsers.map((user) => user._id),
      isPrivate: league.isPrivate,
      games: weekGames,
    };
    try {
      const response = await axios.post(
        "http://localhost:3100/api/league",
        data
      );
      console.log("LEAGUE POST", response.data);
      leagueTest = response.data;
      setLeague(leagueTest);
      return leagueTest;

      // A league is set it up to create the standings on the submit
    } catch (e) {
      console.log(e.message);
    }
  };

  // Handle onChange and user selection
  const handleNameChange = (event) => {
    setLeague({ ...league, name: event.target.value });
  };

  const handleCheckboxChange = (event) => {
    setLeague({ ...league, isPrivate: event.target.checked });
  };

  const handleUserSelection = (event) => {
    const selectedUserId = event.target.value;
    const updatedUsers = users.map((user) =>
      user._id === selectedUserId
        ? { ...user, isSelected: event.target.checked }
        : user
    );
    setUsers(updatedUsers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const leagueCreated = await createLeague();
    console.log("League Created:", leagueCreated);
    const standings = {
      leagueId: leagueCreated._id,
      users: leagueCreated.users,
    };

    // League and standings object created

    console.log("Standings object before being send:", standings);

    try {
      const response = await axios.post(
        "http://localhost:3100/api/standings",
        standings
      ); // Post to create standings
      console.log("STANDINGS POST", response.data);
      navigate("/my-leagues");
    } catch (e) {
      console.log(e.message);
    }
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
              <Form.Control
                type="text"
                placeholder="Enter league's name"
                value={league.name}
                onChange={handleNameChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Label>Type of league:</Form.Label>
              <Form.Check
                type="checkbox"
                label="Private"
                checked={league.isPrivate}
                onChange={handleCheckboxChange}
              />
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
