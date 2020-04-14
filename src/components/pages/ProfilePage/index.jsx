//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Router
import { Redirect, Link } from "react-router-dom";

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
import { SoftwareEngineer, MediaEngineer } from "../../organisms/profiles";

//> CSS
import "./profile.scss";

class ProfilePage extends React.Component {
  state = {};

  saveSettings = (state) => {
    this.props.saveSettings(state);
  };

  componentDidMount = () => {
    console.log("Profile props on startup", this.props);
    if (this.props.match) {
      if (this.props.match.params) {
        if (this.props.match.params.username) {
          const username = this.props.match.params.username;
          if (this.props.globalState.fetchedUser === undefined) {
            this.props.fetchCacheData(username);
          }
        }
      }
    }
  };

  render() {
    const { globalState } = this.props;

    if (globalState.fetchedUser) {
      if (globalState.fetchedUser.platformData.user.type === "software") {
        return (
          <SoftwareEngineer {...this.props} saveSettings={this.saveSettings} />
        );
      } else if (globalState.fetchedUser.platformData.user.type === "media") {
        return (
          <MediaEngineer {...this.props} saveSettings={this.saveSettings} />
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
    } else if (globalState.fetchedUser === null) {
      // Can not get user data
      return (
        <div className="text-center my-5 py-5">
          <MDBIcon icon="times-circle" size="3x" className="text-danger mb-3" />
          <h2>Profile can not be fetched</h2>
          <p className="lead">Please try again later</p>
          <Link to="/">
            <MDBBtn color="danger" size="lg">
              Return to home
            </MDBBtn>
          </Link>
        </div>
      );
    } else if (globalState.fetchedUser === false) {
      // User is not verified
      return (
        <div className="text-center my-5 py-5">
          <MDBIcon icon="times-circle" size="3x" className="text-danger mb-3" />
          <h2>This user has not been verified.</h2>
          <p className="lead">Please try again later</p>
          <Link to="/">
            <MDBBtn color="danger" size="lg">
              Return to home
            </MDBBtn>
          </Link>
        </div>
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
  }
}

export default ProfilePage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
