import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

export default function PlayerEntrance() {
    const [data, setData] = useState([]);
    const apiUrl = "https://v3.football.api-sports.io/fixtures?league=262&season=2022&round=Clausura - 13&timezone=America/Toronto";
    useEffect(() => {
      const fetchData = async () => {
        axios.get(apiUrl, {
          headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
		      "x-rapidapi-key": "e70700818b55ed8754c5f49cf75c67b5"
          }
          }).then(result => {
            console.log('result.data:',result.data)
              setData(result.data.response);
          }).catch((error) => {
            console.log('error in fetchData:', error)
          });
        };  
      fetchData();
    }, []);


  return (
    <>
    <Table striped bordered hover variant="dark">
    <thead>
      <tr>
        <th>Home</th>
        <th>Away</th>
      </tr>
    </thead>
    <tbody>
    {Array.isArray(data) && data.map(fixture => (
      <tr key={fixture.id}>
        <td>{fixture.teams.home.name}</td>
        <td>{fixture.teams.away.name}</td>
      </tr>
    ))}
    </tbody>
  </Table>
  </>

  )
}
