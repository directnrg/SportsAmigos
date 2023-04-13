import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Table, Form, Button } from "react-bootstrap";
import { MyContext } from "../../App";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateGuesses() {
  // Constants and States
  // Login Data is used to retrieve the ID to save Guesses
  const navigate = useNavigate();
  const { id } = useParams();
  const { loginData, setLoginData } = useContext(MyContext);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`http://localhost:3100/api/league/${id}`); // Retrieve the games from the league
      setGames(result.data.games);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newGuesses = [];
    // For each game the guess is generated according to the value checked
    games.forEach((game) => {
      const winner = document.querySelector(
        `input[name="winner-${game._id}"]:checked`
      )?.value;
      if (winner) {
        newGuesses.push({
          game: game._id,
          guess: winner,
        });
      }
    });
    try {
      // Post the gusses date with reference to the user and the league
      const response = await axios.post("http://localhost:3100/api/guess", {
        league: id,
        user: loginData.userId,
        guesses: newGuesses,
      });
      console.log("Guesses post data:", response.data);
      navigate("/my-leagues"); // Navigate to My Leagues page
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Games</h2>
      <Form onSubmit={handleSubmit}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Start Time</th>
              <th>Select result</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game._id}>
                <td>{game.homeTeam}</td>
                <td>{game.awayTeam}</td>
                <td>
                  {new Date(game.startTime).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                  })}
                </td>
                <td>
                  <Form.Check
                    type="radio"
                    name={`winner-${game._id}`}
                    value="home"
                    label={game.homeTeam}
                  />
                  <Form.Check
                    type="radio"
                    name={`winner-${game._id}`}
                    value="tie"
                    label="Tie"
                  />
                  <Form.Check
                    type="radio"
                    name={`winner-${game._id}`}
                    value="away"
                    label={game.awayTeam}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
