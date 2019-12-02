//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { Redirect } from "react-router-dom";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBEdgeHeader,
  MDBFreeBird,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBCardBody,
  MDBIcon,
  MDBCard,
  MDBCardTitle,
  MDBCardImage,
  MDBCardText,
  MDBAnimation,
  MDBAvatar,
  MDBCardUp
} from "mdbreact";

//> Components
// Molecules
import { TabContainer, Avatar, Socialdata } from "../../molecules";
// Organisms
import {
  ResumeTab,
  ProjectsTab,
  OverviewTab,
  EducationTab,
} from "../../organisms/tabs";

//> CSS
import "./profile.scss";

//> Dummy data
// Tab headers
const tabitems = [
  {
    title: "Overview",
    visible: true,
    pill: false,
    notification: false
  },
  {
    title: "Resume",
    visible: true,
    pill: false,
    notification: false
  },
  {
    title: "Projects",
    visible: true,
    pill: "22",
    notification: false
  },
  {
    title: "Education",
    visible: true,
    pill: "0",
    notification: true
  }
];

class Dashboard extends React.Component {
  render() {
    const { globalStore } = this.props;
    
    //> Troubleshooting Point 1
    // Global storage @ rendering of dashboard (Profile\index.jsx)
    //console.log(TSID1, globalStore);

    if(!globalStore.data.logged) { return (<Redirect to="/"/>); }

    let data = globalStore.data;

    if (data) {
      return (
        <div id="profile">
          <MDBContainer className="pt-5">
            <MDBRow>
              <MDBCol md="4" className="text-center">
                <MDBCard testimonial>
                  <MDBCardUp color="info" />
                  <Avatar url={data.user.avatarUrl} alt={data.user.name} />
                  <Socialdata
                    status={{
                      message: data.user.status, 
                      icon: data.user.statusEmojiHTML
                    }}
                    name={data.user.name}
                    company={data.user.company}
                    location={data.user.location}
                    email={data.user.email}
                    languages={data.languages}
                    website={data.user.websiteUrl}
                    accounts={{
                      github: data.user
                    }}
                  />
                </MDBCard>
              </MDBCol>
              <MDBCol md="8">
                <TabContainer items={tabitems} horizontal>
                  <OverviewTab 
                  id={0}
                  contrib={data.contrib}
                  calendar={data.contribCalendar}
                  contribTypes={data.contribTypes}
                  />
                  <ResumeTab id={1} />
                  <ProjectsTab id={2} repos={data.repos} />
                  <EducationTab id={3} />
                </TabContainer>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Dashboard;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
