import React, { useState, useEffect, useContext} from "react";
import { httpService } from "../../services/service";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import jwt from 'jwt-decode'
import { MyContext } from "../../App";
import LeagueModalGrid from "./LeagueModalGrid";




export default function MyLeagues() {
  const { loginData, setLoginData } = useContext(MyContext);
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [myLeaguesList, setMyLeaguesList] = useState([]);
  const [mySelectedLeague, setMySelectedLeague] = useState({});
  const [myLeaguesModalShow, setMyLeaguesModalShow] = useState(false);
  const token = JSON.parse(sessionStorage.getItem('login'))
  const decodedToken = jwt(token.token); 

  //http://localhost:3100/api/leagues/643339c9da183ad9cc24d0e4
  const URL = `http://localhost:3100/api/leagues/${loginData.userId}`;
  

  const modalProps = {
    show:myLeaguesModalShow,
     onHide:() => setMyLeaguesModalShow(false),
     league:mySelectedLeague
  }

  const getLeagues = async ()=>{
    
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

  useEffect(  () => {
   

      getLeagues();

      

    }

    
    , []);

    useEffect(()=>{
      console.log("League List:",myLeaguesList)
    })

  const onLeagueClick=(league)=>{
    setMySelectedLeague(league)
    setMyLeaguesModalShow(true);
  }

  return (
    <Container>
        <Table striped bordered hover variant="dark" className='text-center'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Players</th>
              </tr>
            </thead>
            <tbody>
            { myLeaguesList.map((league, index)=>{
              return(
              <tr onClick={()=>onLeagueClick(league)} key={index}>
                <td>{league.name}</td>
                <td>{league.isPrivate? 'private': 'public'}</td>
                <td>{league.users.length>0?league.users.length:0}</td>
              </tr>)
            })}

            </tbody>

            
          </Table>
          <LeagueModalGrid modalProps={modalProps}  />
    </Container>
  );
}
