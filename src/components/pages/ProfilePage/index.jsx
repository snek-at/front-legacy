//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { Redirect } from "react-router-dom";

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
  MDBBadge,
  MDBIcon,
} from "mdbreact";
// Chart.js
import { Bar } from "react-chartjs-2";

//> Components
import {
  ProfileContent,
} from "../../organisms";
import {
  Overview,
  Projects,
} from "../../organisms/tabs";

//> CSS
import "./profile.scss";

class ProfilePage extends React.Component {
  state = {
    dataBar: {
      labels: ["JavaScript", "HTML", "CSS", "PHP"],
      datasets: [
        {
          label: "% of code",
          data: [70, 20, 7, 3],
          backgroundColor: [
            "rgba(119, 189, 67,0.4)",
            "rgba(119, 189, 67,0.3)",
            "rgba(119, 189, 67,0.1)",
            "rgba(119, 189, 67,0.1)",
          ],
          borderWidth: 2,
          borderColor: [
            "rgba(119, 189, 67, 1)",
            "rgba(119, 189, 67, .8)",
            "rgba(119, 189, 67, .5)",
            "rgba(119, 189, 67, .4)",
          ]
        }
      ]
    },
    barChartOptions: {
      responsive: true,
      maintainAspectRatio: true,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            barPercentage: 1,
            gridLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)"
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)"
            },
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  }

  render() {
    const { globalState } = this.props;

    if(globalState.loading && !globalState.logged) return <Redirect to="/"/>;
    return (
      <MDBContainer id="profile" className="py-3">
        <MDBRow>
          <MDBCol md="3" className="social">
            <img 
            className="img-fluid"
            src="https://scontent.fvie2-1.fna.fbcdn.net/v/t1.0-9/p960x960/74911486_2591301250955765_554055196410380288_o.jpg?_nc_cat=103&_nc_ohc=1-5GKWHw314AX8-YdG1&_nc_ht=scontent.fvie2-1.fna&_nc_tp=1002&oh=cd2a8858e5ddfe026686d23966948bdf&oe=5ED6BCFE"
            />
            <div className="bg-elegant py-3 px-3">
              <h4 className="mb-0">Christian Aichner</h4>
              <small className="text-muted py-3">Werbeagentur Christian Aichner</small>
              <div className="badges">
                <MDBBadge color="elegant-color">
                  Founder
                </MDBBadge>
                <MDBBadge color="purple">
                  Pro
                </MDBBadge>
                <MDBBadge color="orange">
                  Sponsor
                </MDBBadge>
              </div>
              <div className="connected mt-2 text-muted">
                <MDBIcon fab icon="github" size="lg" className="active" />
                <MDBIcon fab icon="gitlab" size="lg" className="active" />
                <MDBIcon fab icon="bitbucket" size="lg" />
              </div>
              <p className="mb-1 mt-1"><a href="#!">#3</a> in your region</p>
              <div className="mt-2">
              <MDBBtn
              color="green"
              className="mx-0 float-left px-4"
              size="md"
              >
              <MDBIcon icon="check" className="mr-2" />
              Following
              </MDBBtn>
              <MDBBtn
              color="elegant"
              className="mx-0 float-right px-4"
              size="md"
              >
              <MDBIcon icon="cogs" />
              </MDBBtn>
              <div className="clearfix" />
              </div>
            </div>
            <div className="bg-light py-3 px-2">
              <small className="px-1">
              I'm a SNEK, follow me. Hissss.
              </small>
              <hr />
              <p>My organisations</p>
              
              <hr />
              <p>My top languages</p>
              <Bar data={this.state.dataBar} options={this.state.barChartOptions} />
            </div>
          </MDBCol>
          <MDBCol md="9" className="content p-0">
            <ProfileContent>
              <Overview
              id={0}
              />
              <Projects
              id={1}
              />
            </ProfileContent>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default ProfilePage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
