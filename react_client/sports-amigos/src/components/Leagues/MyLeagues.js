import React, { useState, useEffect, useContext} from "react";
import { httpService } from "../../services/service";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import jwt from 'jwt-decode'
import { MyContext } from "../../App";
import LeagueModalGrid from "./LeagueModalGrid";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Badge } from 'react-bootstrap';




export default function MyLeagues() {

  //Context
  const {loginData} = useContext(MyContext);

  //states and hooks
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [myLeaguesList, setMyLeaguesList] = useState([]);
  const [mySelectedLeague, setMySelectedLeague] = useState({});
  const [myLeaguesModalShow, setMyLeaguesModalShow] = useState(false);
  const [areMyLeaguesPrivate, setAreMyLeaguesPrivate] = useState(false);

  //Decoding token
  const token = JSON.parse(sessionStorage.getItem('login'))
  const decodedToken = jwt(token.token); 

  //Constants
  const URL = `http://localhost:3100/api/leagues/${loginData.userId}`;
  
  //Setting props for modal component
  const modalProps = {
    show:myLeaguesModalShow,
     onHide:() => setMyLeaguesModalShow(false),
     league:mySelectedLeague,
  }

  //Callbacks
  const onLeagueTypeChange = () => {
    //Toggling state when toggle btn changes
    setAreMyLeaguesPrivate(!areMyLeaguesPrivate)
    console.log(areMyLeaguesPrivate)
  }

  const getLeagues = async ()=>{
    
    //Get leagues by user
    try{
    
      console.log(" token",token.token)
      console.log("Decoded token",decodedToken)
      console.log("User ID: ", decodedToken.user.id)
      console.log('headers',{ headers: { 'x-auth-token':token.token }});
      const res = await httpService.get(URL,{ headers: { 'x-auth-token':token.token }});
      console.log('MyLeagues:',res)
      setMyLeaguesList(res)

    }
    catch(e){
      console.log(e.message)
    }
    
  }

  //Change states on league clicked
  const onLeagueClick=(league)=>{
    setMySelectedLeague(league)
    setMyLeaguesModalShow(true);
  }

  //Use Effects 
  useEffect(  () => {
   
    //Get leagues first time component rendered
      getLeagues();   

    }

    
    , []);

    useEffect(()=>{
      console.log("League List:",myLeaguesList)
    })

 

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
              {/** Displaying public or private leagues depending on toggle switch btn */}
            { areMyLeaguesPrivate? myLeaguesList.filter(league => league.isPrivate === true).map((league, index)=>{
              return(
              <tr onClick={()=>onLeagueClick(league)} key={index}>
                <td>{league.name}</td>
                <td>{league.isPrivate? 'private': 'public'}</td>
                <td>{league.users.length>0?league.users.length:0}</td>
              </tr>)
            })
            :

            myLeaguesList.filter(league => league.isPrivate === false).map((league, index)=>{
              return(
              <tr onClick={()=>onLeagueClick(league)} key={index}>
                <td>{league.name}</td>
                <td>{league.isPrivate? 'private': 'public'}</td>
                <td>{league.users.length>0?league.users.length:0}</td>
              </tr>)
            })
          }

            </tbody>

            
          </Table>
          <LeagueModalGrid modalProps={modalProps}  />
    </Container>
  );
}
