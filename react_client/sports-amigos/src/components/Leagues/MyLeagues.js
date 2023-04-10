import React, { useState, useEffect, useContext} from "react";
import { httpService } from "../../services/service";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import jwt from 'jwt-decode'
//import { MyContext } from '../App';
import { MyContext } from "../../App";



export default function MyLeagues() {
  const { loginData, setLoginData } = useContext(MyContext);
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [leaguesList, setLeagueList] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState({});
  const token = JSON.parse(sessionStorage.getItem('login'))
  const decodedToken = jwt(token.token); 

  const URL = 'http://localhost:3100/api/leagues'

  const getLeagues = async ()=>{
    
    try{
    
      console.log(" token",token.token)
      console.log("Decoded token",decodedToken)
      console.log("User ID: ", decodedToken.user.id)
      console.log('headers',{ headers: { 'x-auth-token':token.token }});
      const res = await httpService.get(URL,{ headers: { 'x-auth-token':token.token }});
      console.log('MyLeagues:',res)
      setLeagueList(res)

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
      console.log("League List:",leaguesList)
    })

  const onLeagueClick=(league)=>{
    setSelectedLeague(league)
    toggleLeagueModal();
  }

  //toggle function
  const toggleLeagueModal = () => {
    setShowLeagueModal(!showLeagueModal);
  };


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
            { leaguesList.map((league, index)=>{
              return(
              <tr onClick={()=>onLeagueClick(league)} key={index}>
                <td>{league.name}</td>
                <td>{league.isPrivate? 'private': 'public'}</td>
                <td>{league.users.length>0?league.users.length:0}</td>
              </tr>)
            })}

            </tbody>

            
          </Table>
    </Container>
  );

  // return (
  //   <>
  //     <div>MyLeagues</div>
  //     {/**TODO - button should be per league */}
  //     {sampleLeagueList.length > 0 && (
  //       sampleLeagueList.map((league) => (
  //         <div key={league._id}>
  //           <button onClick={toggleLeagueModal}>Details</button>
  //           {showLeagueModal && (
  //             <LeagueModal
  //               leagueModalToggle={setShowLeagueModal}
  //               leagueId={league._id}
  //             />
  //           )}
  //         </div>
  //       )))}
  //   </>
  // );
}
