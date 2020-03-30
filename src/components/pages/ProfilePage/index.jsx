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
  MDBView,
  MDBMask,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBProgress,
  MDBIcon,
} from "mdbreact";
// Chart.js
import { Doughnut } from "react-chartjs-2";

//> Components
import {
  SoftwareEngineer,
  MediaEngineer,
} from "../../organisms/profiles";

//> CSS
import "./profile.scss";

class ProfilePage extends React.Component {
  state = {};

  componentDidMount = () => {
    if(this.props.match){
      if(this.props.match.params){
        if(this.props.match.params.username){
          const username = this.props.match.params.username;
          if(this.props.globalState.fetchedUser === undefined){
            this.props.fetchProfileData(username);
          }
        }
      }
    }
  }

  render(){
    console.log("GS",this.props);
    const { globalState } = this.props;
    if(globalState.fetchedUser){
      if(globalState.fetchedUser.platformData.user.type === "software"){
        return(
          <SoftwareEngineer {...this.props} />
        );
      } else if (globalState.fetchedUser.platformData.user.type === "media"){
        return(
          <MediaEngineer {...this.props} />
        );
      } else {
        return (
          <div className="text-center my-5 py-5">
            <div className="spinner-grow text-success" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div className="text-center my-5 py-5">
          <div className="spinner-grow text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
  }
}

export default ProfilePage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
