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

//> Images
// To be added

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

//> Handlers
// To be added

//> CSS
import "./profile.scss";

class Dashboard extends React.Component {

  state = {};

  setTabItems = () => {

    // Get project count
    console.log(this.props.globalStore.data);
    const projectcount = this.props.globalStore.data.repos.length;

    this.setState({
      tabitems: [
        {
          title: "Overview",
          visible: true,
          pill: false,
          notification: false
        },
        {
          title: "Projects",
          visible: true,
          pill: projectcount,
          notification: true
        },
        {
          title: "Education",
          visible: true,
          notification: false
        },
        {
          title: "Posts",
          visible: true,
          pill: "0",
          notification: false
        },
        {
          title: "Papers",
          visible: true,
          pill: "0",
          notification: false
        },
        {
          title: "Talks",
          visible: true,
          pill: "0",
          notification: false
        },
      ]
    });
  }

  render() {
    const { globalStore } = this.props;
    
    //> Debugging access point - state
    //console.log(globalStore);

    if(!globalStore.data.logged) { return (<Redirect to="/"/>); }

    let data = globalStore.data;
  
    // Get tab items
    if(data && !this.state.tabitems){
      this.setTabItems();
    }

    if (data && this.state.tabitems) {
      return (
        <div id="profile">
          <MDBContainer className="py-5">
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
                <TabContainer items={this.state.tabitems} horizontal>
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
