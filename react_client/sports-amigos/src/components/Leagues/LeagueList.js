import React, { useState, useEffect } from "react";
import { httpService } from "../../services/service";
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Button from "react-bootstrap/esm/Button";
import LeagueModalGrid from "./LeagueModalGrid";


export default function LeagueList() {
  const [allLeagueList, setAllLeagueList] = useState([]);
  const [allSelectedLeague, setAllSelectedLeague] = useState({});
  const [leagueListModalShow, setLeagueListModalShow] = useState(false);

  const URL = 'http://localhost:3100/api/leagues'

  const getLeagues = async ()=>{
    try{
      const res = await httpService.get(URL,{});
    console.log('Leagues:',res)
    setAllLeagueList(res)

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
      console.log("League List:",allLeagueList)
    })

  const onLeagueClick=(league)=>{
    setAllSelectedLeague(league)
    setLeagueListModalShow(true);
  }

  const modalProps = {
    show:leagueListModalShow,
     onHide:() => setLeagueListModalShow(false),
     league:allSelectedLeague
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
            { allLeagueList.map((league, index)=>{
              return(
              <tr onClick={()=>onLeagueClick(league)} key={index}>
                <td>{league.name}</td>
                <td>{league.isPrivate? 'private': 'public'}</td>
                <td>{league.users.length>0?league.users.length:0}</td>
              </tr>)
            })}

            </tbody>

            
          </Table>
          <>

      {/*<LeagueModalGrid show={leagueListModalShow} onHide={() => setLeagueListModalShow(false)}  />*/}
      <LeagueModalGrid modalProps={modalProps}  />
      
    </>



    </Container>

    
  );

}

