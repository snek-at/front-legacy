//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional
import Typed from "react-typed";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBAlert,
  MDBIcon,
} from "mdbreact";

//> Components
import {
  Register,
} from "../../organisms";

//> Images
import ImageRanking from '../../../assets/body/ranking.png';
import ImageProfiles from '../../../assets/body/profiles.png';
import ImageTrophy from '../../../assets/body/trophy.png';

//> CSS
import "./homepage.scss";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotate: -2,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    if(window.pageYOffset < 400) {
      window.addEventListener('scroll', this.handleScroll);
    } else {
      this.setState({
        rotate: 0,
      });
    }
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  };

  getRotation = () => {
    return {
      transform: `rotate(${this.state.rotate}deg)`
    }
  }

  handleScroll(event) {
    console.log(window.pageYOffset);
    if(window.pageYOffset <= 400){
      if(window.pageYOffset / 200 < 402){
        this.setState({
          rotate: -2 + (window.pageYOffset / 200)
        });
      } else {
        this.setState({
          rotate: 0,
        });
      }
    } else if(window.pageYOffset > 400){
      this.setState({
        rotate: 0,
      });
    }
  };

  render() {
    console.log(this.state);
    return (
      <div id="home" className="pt-5">
        <MDBContainer className="mb-5 pb-5">
          <MDBRow className="flex-center">
            <MDBCol md="6" className="whois d-flex align-items-center">
              <div className="d-block">
                <div className="d-flex">
                  <h1>
                    <Typed
                      strings={[
                        'Built for developers.',
                        'Built for photographers.',
                        'Built for programmers.',
                        'Built for engineers.',
                        'Built for students.',
                        'Built for teachers.',
                        'Built for sneks.'
                      ]}
                      typeSpeed={30}
                      backSpeed={50}
                      loop >
                    </Typed>
                  </h1>
                </div>
                <div>
                  <p className="lead">Open Source Social Network</p>
                  <div className="mt-4">
                  <MDBBtn
                  color="white"
                  className="btn-underlined-red"
                  >
                  Donate
                  <MDBIcon far icon="heart" className="pl-1 red-text" />
                  </MDBBtn>
                  <MDBBtn
                  color="white"
                  className="btn-underlined-blue"
                  >
                  Our mission
                  <MDBIcon icon="angle-right" className="pl-1 blue-text" />
                  </MDBBtn>
                  </div>
                </div>
              </div>
            </MDBCol>
            <MDBCol md="6">
              <MDBCard className="px-3 py-4">
                <Register />
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <div className="position-relative">
          <div className="banner-wrapper">
            <div 
            className="banner"
            style={this.getRotation()}
            >
            </div>
          </div>
        </div>
        <section className="features pb-5">
          <MDBContainer>
            <MDBRow className="flex-center text-center white-text">
              <MDBCol md="4">
                <img src={ImageProfiles} alt="You get profiles" className="img-fluid"/>
                <h2>Profiles</h2>
              </MDBCol>
              <MDBCol md="4">
                <img src={ImageRanking} alt="You get profiles" className="img-fluid"/>
                <h2>Visualization</h2>
              </MDBCol>
              <MDBCol md="4">
                <img src={ImageTrophy} alt="You get profiles" className="img-fluid"/>
                <h2>Achievements</h2>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      </div>
    );
  }
}

export default HomePage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
