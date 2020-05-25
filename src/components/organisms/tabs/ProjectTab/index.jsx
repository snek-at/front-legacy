//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// React PropTypes
import PropTypes from "prop-types";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBAlert,
  MDBInput,
  MDBBtn,
  MDBIcon,
} from "mdbreact";

//> CSS
import "./projecttab.scss";

//> Components
import { Project } from "../../../atoms";
//#endregion

//#region > Components
class ProjectTab extends React.Component {
  render() {
    const { repoList } = this.props;

    return (
      <>
        <h3 className="font-weight-bold">Repositories</h3>
        <MDBRow className="project-list">
          {repoList &&
            repoList.map((repo, i) => {
              return <Project repo={repo} key={i} />;
            })}
        </MDBRow>
      </>
    );
  }
}
//#endregion

//#region > PropTypes
ProjectTab.propTypes = {
  repoList: PropTypes.array.isRequired,
};
//#endregion

//#region > Exports
export default ProjectTab;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
