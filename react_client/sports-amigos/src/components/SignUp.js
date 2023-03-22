import {React, useRef, useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBInput,
}
  from 'mdb-react-ui-kit';

import {httpService} from '../services/service';
import {validation} from '../services/validation';

export default function SignUp() {

  const navigate = useNavigate();

  const URL = 'http://localhost:3100/api/user'//'https://catfact.ninja/fact' // 'http://localhost:3000/';
  //Using Refs
  const firstNameRef = useRef('');
  const lastNameRef = useRef('');
  const emailRef = useRef('');
  const passwordRef = useRef('');
  

  const [errorMsgs, setErrorMsg] =  useState([]);

  //Callbacks
  const onsubmit = async()=>{
    let valErrors = [];
    let canPost = true;
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    console.log("On Submit", errorMsgs)
    

    //Validating
    if(!validation.name.test(firstName)){
      valErrors.push('First name should not be null, or contain spaces, numbers or special characters')
      canPost = false;
    } 
    if (!validation.name.test(lastName)){
      valErrors.push('Last name should not be null, or contain spaces, numbers or special characters')
      canPost = false;
    }

    if (!validation.password.test(password)){
      valErrors.push('The password should not be null,  contain any spaces, and should have at least one number and special character')
      canPost = false;
    }

    if (!validation.email.test(email)){
      valErrors.push('The email is not a valid email string form')
      canPost = false;
    }

  

    



    if (canPost){
      try{
        const newUser = {
          fullName: `${firstName} ${lastName}`,
          email: email,
          password:password

        }
        
        const response = await httpService.post(URL,newUser);
       
        //navigate('/log-in')

        if(response.response && response.response.status===400|500){
          console.log('response status:',response.response.status)
          console.log('response data:',response.response.data)
          valErrors.push(response.response.data.message)
        } else {
          alert('User Created')
          navigate('/log-in')
        }

      }

      catch(e){
        console.log(e.message)
      }
      
      
    } else console.log(valErrors)

    setErrorMsg(valErrors)
    

  }

  useEffect(()=>{
    console.log(URL+'/user')
    console.log(errorMsgs)
  },);

  useEffect(()=>{
    setErrorMsg([])
  },[])


  return (
    <MDBContainer fluid>

      <div className="p-5 bg-image"  style={{ backgroundImage: 'url(https://mdbootstrap.com/img/new/textures/full/171.jpg)', height: '300px' }}></div>

      <MDBCard className=' p-5 shadow-5' style={{ width: '50%',marginTop: '-100px', marginLeft:'auto', marginRight:'auto', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)' }}>
        <MDBCardBody className='p-5 text-center'>

          <h2 className="fw-bold mb-5">Sign up now</h2>

          <MDBRow>
            <MDBCol col='6'>
              <MDBInput ref= {firstNameRef} wrapperClass='mb-4' label='First name' id='First name' type='text' />
            </MDBCol>
            <MDBCol col='6'>
              <MDBInput ref= {lastNameRef} wrapperClass='mb-4' label='Last name' id='Last name' type='text' />
            </MDBCol>

          </MDBRow>

          <MDBRow>

            <MDBCol col='6'>
              <MDBInput ref={emailRef} wrapperClass='mb-4' label='Email' id='email' type='email' />
            </MDBCol>

            <MDBCol col='6'>
              <MDBInput ref={passwordRef} wrapperClass='mb-4' label='Password' id='password' type='password' />
            </MDBCol>


          </MDBRow>

    

          <MDBBtn className='w-100 mb-4' size='md' onClick={onsubmit} >sign up</MDBBtn>

          {errorMsgs.length>0?  errorMsgs.map((msg, index)=><Alert key={index} variant={'danger'}> {msg}</Alert>):null}
        </MDBCardBody>



        
      </MDBCard>

    </MDBContainer>
  );
}

