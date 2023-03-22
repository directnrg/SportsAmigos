import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function LeagueStandings() {
    const [nextWeek, setnextWeek] = useState([]);
    const [lastWeek, setLastWeek] = useState([]);

    const nextWeekApi = "https://v3.football.api-sports.io/fixtures?league=262&season=2022&round=Clausura - 13&timezone=America/Toronto";
    const lastWeekApi = "https://v3.football.api-sports.io/fixtures?league=262&season=2022&round=Clausura - 12&timezone=America/Toronto";

    useEffect(() => {
      const fetchnextWeek = async () => {
        axios.get(nextWeekApi, {
          headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
		      "x-rapidapi-key": "5a5e62422ae2bb5cc2b8485fdb968a64"
          }
          }).then(result => {
            console.log('result.nextWeek:',result.data)
              setnextWeek(result.data.response);
          }).catch((error) => {
            console.log('error in fetchnextWeek:', error)
          });
        };
      fetchnextWeek();

    }, []);

    useEffect(() => {
      const fetchlastWeek = async () => {
        axios.get(lastWeekApi, {
          headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
		      "x-rapidapi-key": "5a5e62422ae2bb5cc2b8485fdb968a64"
          }
          }).then(result => {
            console.log('result.lastWeek:',result.data)
              setLastWeek(result.data.response);
          }).catch((error) => {
            console.log('error in fetchlastWeek:', error)
          });
        };
      fetchlastWeek();

    }, []);

  return (
    <>

    <Container className='text-center'>
      <Row>
        <Col>
         {nextWeek[2] && <label>League: {nextWeek[2].league.name} - Round: {nextWeek[2].league.round}</label>}
        </Col>
        <Col>
         {lastWeek[2] && <label>League: {lastWeek[2].league.name} - Round: {lastWeek[2].league.round}</label>}
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover variant="dark" className='text-center'>
            <thead>
              <tr>
                <th>Home</th>
                <th>Away</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
            {Array.isArray(nextWeek) && nextWeek.map(fixture => (
              <tr key={fixture.id}>
                <td>{fixture.teams.home.name}</td>
                <td>{fixture.teams.away.name}</td>
                <td>{fixture.fixture.date}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        </Col>
        <Col>
        <Table striped bordered hover variant="dark" className='text-center'>
            <thead>
              <tr>
                <th>Home</th>
                <th>Result</th>
                <th>Away</th>
              </tr>
            </thead>
            <tbody>
            {Array.isArray(lastWeek) && lastWeek.map(fixture => (
              <tr key={fixture.id}>
                <td>{fixture.teams.home.name}</td>
                <td>{fixture.goals.home} - {fixture.goals.away}</td>
                <td>{fixture.teams.away.name}</td>
              </tr>
            ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <h1>League Standings</h1>
      </Row>
      <Row>
      <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Position</th>
          <th>Team</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1st</td>
          <td>Soccer Wizards</td>
          <td>35</td>
        </tr>
        <tr>
          <td>2nd</td>
          <td>Porcinos FC</td>
          <td>32</td>
        </tr>
        <tr>
          <td>3rd</td>
          <td>Pink Hats</td>
          <td>25</td>
        </tr>
      </tbody>
    </Table>
      </Row>
    </Container>
    
  </>

  )
}
