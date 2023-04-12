import React, { useState, useEffect } from "react";
import { httpService } from "../../services/service";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from "react-bootstrap/esm/Button";
import LeagueModalGrid from "./LeagueModalGrid";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Badge } from 'react-bootstrap';


export default function LeagueList() {
  const [allLeagueList, setAllLeagueList] = useState([]);
  const [allSelectedLeague, setAllSelectedLeague] = useState({});
  const [leagueListModalShow, setLeagueListModalShow] = useState(false);
  const [areAllLeaguesPrivate, setAreAllLeaguesPrivate] = useState(false);
 

  const URL = 'http://localhost:3100/api/leagues'

  const getLeagues = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem('login'))

      console.log('headers', { headers: { 'x-auth-token': token.token } });
      const res = await httpService.get(URL, { headers: { 'x-auth-token': token.token } });
      console.log('Leagues:', res)
      setAllLeagueList(res)

     


    }
    catch (e) {
      console.log(e.message)
    }

  }

  const onLeagueTypeChange = () => {
    setAreAllLeaguesPrivate(!areAllLeaguesPrivate)
    console.log(areAllLeaguesPrivate)
  }

  useEffect(() => {
    getLeagues();
  }
    , []);

  useEffect(() => {
    console.log("League List:", allLeagueList) 
  })

  const onLeagueClick = (league) => {
    setAllSelectedLeague(league)
    setLeagueListModalShow(true);
  }

  const modalProps = {
    show: leagueListModalShow,
    onHide: () => setLeagueListModalShow(false),
    league: allSelectedLeague,
  }

  return (
    <Container>
      <Container >
        <Row xs="auto" className="justify-content-md-center">
          <Col>  <h4 className='text-center'><Badge bg="dark">Public</Badge></h4></Col>
          <Col> <Form.Switch type="switch" onChange={onLeagueTypeChange}  ></Form.Switch></Col>
          <Col> <h4 className='text-center'><Badge bg="dark">Private</Badge></h4></Col>
        </Row>

      </Container>

      <Table striped bordered hover variant="dark" className='text-center'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Players</th>
          </tr>
        </thead>
        <tbody>
          {areAllLeaguesPrivate? allLeagueList.filter(league => league.isPrivate === true).map((league, index) => {
            return (
              <tr onClick={() => onLeagueClick(league)} key={index}>
                <td>{league.name}</td>
                <td>{league.isPrivate ? 'private' : 'public'}</td>
                <td>{league.users.length > 0 ? league.users.length : 0}/7</td>
              </tr>)
          })
          :
          allLeagueList.filter(league => league.isPrivate === false).map((league, index) => {
            return (
              <tr onClick={() => onLeagueClick(league)} key={index}>
                <td>{league.name}</td>
                <td>{league.isPrivate ? 'private' : 'public'}</td>
                <td>{league.users.length > 0 ? league.users.length : 0}/7</td>
              </tr>)
          })
          
        
        }

        </tbody>


      </Table>
      <>

        {/*<LeagueModalGrid show={leagueListModalShow} onHide={() => setLeagueListModalShow(false)}  />*/}
        <LeagueModalGrid modalProps={modalProps} />

      </>



    </Container>


  );

}

