import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Table, Form, Button } from 'react-bootstrap';
import { MyContext } from '../../App';

export default function CreateGuesses() {  
  const { loginData, setLoginData } = useContext(MyContext);
    const [games, setGames] = useState([]);
    const [guesses, setGuesses] = useState({
      user: '',
      game: '',
      league: '',
      guess: '',
      userPoints: ''
    })

    useEffect(() => {
      const fetchData = async () => {
        const result = await axios("http://localhost:3100/api/games-of-the-week");
        setGames(result.data.games);
      };
      fetchData();
    }, []);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const newGuesses = [];
      games.forEach((game) => {
        const winner = document.querySelector(`input[name="winner-${game._id}"]:checked`)?.value;
        if (winner) {
          newGuesses.push({
            user: loginData.userId,
            game: game._id,
            league: game.league,
            guess: winner === "home" ? "1" : winner === "tie" ? "X" : "2",
            userPoints: 0
          });
        }
      });
      try {
        const response = await axios.post("http://localhost:3100/api/user-guesses", { guesses: newGuesses });
        console.log(response.data);
        setGuesses(response.data.guesses);
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
                  <td>{new Date(game.startTime).toLocaleString('en-US',{  year: 'numeric', month: 'long', day: 'numeric',hour: 'numeric'})}</td>
                  <td>
                    <Form.Check
                      type="radio"
                      name={`winner-${game._id}`}
                      value="home"
                      label={game.homeTeam}
                    />
                    <Form.Check
                      type="radio"
                      name='tie'
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