import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

export default function App() {
  //Just an static footer template
  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href='https://www.facebook.com/' className='me-4 text-reset'>
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href='https://twitter.com/' className='me-4 text-reset'>
            <MDBIcon fab icon="twitter" />
          </a>
          <a  href= 'https://www.google.com/' className='me-4 text-reset'>
            <MDBIcon fab icon="google" />
          </a>
          <a  href='https://www.instagram.com/linked' className='me-4 text-reset'>
            <MDBIcon fab icon="instagram" />
          </a>
          <a href='https://es.linkedin.com/github' className='me-4 text-reset'>
            <MDBIcon fab icon="linkedin" />
          </a>
          <a  href='https://github.com/' className='me-4 text-reset'>
            <MDBIcon fab icon="github" />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon icon="gem" className="me-3" />
                Four Amigos
              </h6>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Leagues</h6>
              <p>
                <a href='#!' className='text-reset'>
                  NFL
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Liga MX
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  NHL
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Premier League
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Sports</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Soccer
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Hockey
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Tennis
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Olympics
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                941 Progress Ave, Scarborough, ON, M1G3T8
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-2" />
                four4migos@example.com
              </p>
              <p>
                <MDBIcon icon="phone" className="me-2" /> + 01 234 567 88
              </p>
              <p>
                <MDBIcon icon="print" className="me-2" /> + 01 234 567 89
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2023 Copyright:
        <a className='text-reset fw-bold' href='https://mdbootstrap.com/'>
          Four Amigos
        </a>
      </div>
    </MDBFooter>
  );
}
