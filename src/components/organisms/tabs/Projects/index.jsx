//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBTabPane,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
} from "mdbreact";

//> CSS
import "./projects.scss";

class Projects extends React.Component {
  state = {};

  render() {
    return (
      <MDBTabPane tabId={this.props.id} role="tabpanel">
        <h3 className="font-weight-bold">Repositories</h3>
        <MDBRow className="project-list">
          <MDBCol md="6">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <li>
            <div>
              <p className="lead mb-1 float-left">
              snek/front
              </p>
              <small className="mb-1 float-right text-muted">
              <MDBIcon icon="square" className="pr-1" style={{color: "green"}} />
              JavaScript
              </small>
            </div>
            <div className="clearfix" />
            <div>
              <img src="" alt=""/>
              <small>Owned by Christian Aichner</small>
            </div>
            <div className="py-2">
              <img 
              className="img-badge"
              />
            </div>
            </li>
          </a>
          </MDBCol>
        </MDBRow>
      </MDBTabPane>
    );
  }
}

export default Projects;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
