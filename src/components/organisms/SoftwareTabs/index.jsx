//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBContainer } from "mdbreact";

//> Components
import { ProjectTab } from "../tabs";
//#endregion

//#region > Components
class SoftwareEngineer extends React.Component {
  state = {
    activeTab: 0,
    tabItems: [
      {
        title: "Overview",
        visible: true,
        pill: false,
        notification: false,
      },
      {
        title: "Projects",
        visible: true,
        pill: this.props.projectCount ? this.props.projectCount : false,
        notification: false,
      },
      {
        title: "Education",
        visible: true,
        notification: false,
      },
      {
        title: "Posts",
        visible: true,
        pill: "0",
        notification: false,
      },
      {
        title: "Papers",
        visible: true,
        pill: "0",
        notification: false,
      },
      {
        title: "Talks",
        visible: true,
        notification: false,
        pill: this.props.talksCount ? this.props.talksCount : false,
        notification: false,
      },
    ],
  };

  render() {
    const { globalState } = this.props;
    const { activeTab } = this.state;

    return (
      <div className="profile-content">
        <ul class="nav nav-tabs">
          {this.state.tabItems.map((item, i) => {
            return (
              <li className="nav-item">
                <span
                  className={activeTab === i ? "nav-link active" : "nav-link"}
                  onClick={() => this.setState({ activeTab: i })}
                >
                  {item.title}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="p-3">
          {activeTab === 1 && (
            <ProjectTab
              repoList={
                globalState.fetchedUser &&
                globalState.fetchedUser.platformData.profile.repositories
              }
            />
          )}
        </div>
      </div>
    );
  }
}
//#endregion

//#region > Exports
export default SoftwareEngineer;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
