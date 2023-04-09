import React, { useState, useEffect } from "react";
import { httpService } from "../../services/service";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';


export default function MyLeagues() {
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [leaguesList, setLeagueList] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState({});

  const URL = 'http://localhost:3100/api/leagues'

  const getLeagues = async ()=>{
    try{
      const res = await httpService.get(URL,{});
    console.log('Leagues:',res)
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
