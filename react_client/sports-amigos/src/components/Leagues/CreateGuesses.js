import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Button } from 'react-bootstrap';

export default function CreateGuesses() {  
    const [games, setGames] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const result = await axios("http://localhost:3100/api/games-of-the-week");
        setGames(result.data.games);
      };
      fetchData();
    }, []);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // handle form submission here
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
                      value={game.homeTeam}
                      label={game.homeTeam}
                    />
                    <Form.Check
                      type="radio"
                      name={`winner-${game._id}`}
                      value={game.awayTeam}
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
  };