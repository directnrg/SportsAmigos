import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { httpService } from "../../services/service";
import Table from 'react-bootstrap/Table';
import jwt from 'jwt-decode'
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Badge } from 'react-bootstrap';

export default function Standings() {

    //Constants 
    const URL = 'http://localhost:3100/api/standing/league/'

    //States
    const [standings, setStandings] = useState({})
    const { id } = useParams();

    //Callbacks
    const getStandings = async () => {
        try {
            const token = JSON.parse(sessionStorage.getItem('login'))

            console.log('headers', { headers: { 'x-auth-token': token.token } });
            const res = await httpService.get(URL + id, { headers: { 'x-auth-token': token.token } });
            console.log('Standings:', res)
            setStandings(res)

        }
        catch (e) {
            console.log(e.message)
        }
    }

    useEffect(()=>{
        getStandings()
    },[])

    useEffect(()=>{
        console.log("Standings",standings)
      
    })
    
    //Conditional Rendering
    if (standings ==null) {
        return (
            <>
                <h1>No standings yet</h1>
            </>
        )
    }

    else {
        return (
            <Container>
                <h2 className='text-center'><Badge bg="dark"> {standings?.league?.name}</Badge></h2>
              
                <Table striped bordered hover variant="dark" className='text-center'>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {standings?.standings?.map((standing, index) => {
                            return (
                                <tr key={index}>
                                    <td>{standing?.user?.fullName}</td>
                                    <td>{standing?.points}</td>
                                </tr>)
                        })
                        }

                    </tbody>


                </Table>

            </Container>

        )

    }

}
