//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBContainer, MDBBadge } from "mdbreact";

//> Components
import { ProjectTab, OverviewTab, TalksTab } from "../tabs";
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
        pill: this.props.globalState?.fetchedUser?.platformData?.profile
          ?.repositories
          ? this.props.globalState?.fetchedUser?.platformData?.profile
              ?.repositories?.length
          : "0",
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
        pill: this.props.globalState.fetchedUser.platformData.talks
          ? this.props.globalState.fetchedUser.platformData.talks.length
          : "0",
        notification: false,
      },
    ],
  };

  render() {
    const { globalState } = this.props;
    const { activeTab } = this.state;

    return (
      <div className="profile-content">
        <ul className="nav nav-tabs">
          {this.state.tabItems.map((item, i) => {
            return (
              <li className="nav-item" key={i}>
                <span
                  className={activeTab === i ? "nav-link active" : "nav-link"}
                  onClick={() => this.setState({ activeTab: i })}
                >
                  {item.title}
                  <MDBBadge color="primary">{item.pill}</MDBBadge>
                </span>
              </li>
            );
          })}
        </ul>
        <div className="p-3">
          {activeTab === 0 && (
            <OverviewTab
              platformData={
                globalState.fetchedUser && globalState.fetchedUser.platformData
              }
            />
          )}
          {activeTab === 1 && (
            <ProjectTab
              repoList={
                globalState.fetchedUser &&
                globalState.fetchedUser.platformData.profile.repositories
              }
            />
          )}
          {activeTab > 1 && activeTab < 5 && (
            <p className="text-muted">
              This feature is not available just yet.
            </p>
          )}
          {activeTab === 5 && <TalksTab {...this.props} />}
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
