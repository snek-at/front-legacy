//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBTabPane,
  MDBTabContent,
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBBadge,
  MDBIcon,
} from "mdbreact";

import { Projects, Talks, OverviewSoftware } from "../../organisms/tabs";

class ProfileContent extends React.Component {
  state = {
    activeTab: 0,
    tabitems: [
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
        pill: "0",
        notification: false,
      },
    ],
  };

  componentDidUpdate = () => {
    console.log("Updated");
  };

  handleTabChange = (id) => {
    this.setState({
      activeTab: id,
    });
  };

  render() {
    const { globalState } = this.props;

    console.log(this.state.activeTab);

    return (
      <MDBContainer className="classic-tabs p-0">
        <MDBNav classicTabs color="grey">
          {this.state.tabitems &&
            this.state.tabitems.map((item, key) => {
              if (item.visible) {
                return (
                  <MDBNavItem key={key}>
                    <MDBNavLink
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        this.handleTabChange(key);
                      }}
                      className={
                        this.state.activeTab === key ? "seriouslyActive" : ""
                      }
                      role="tab"
                    >
                      {item.title}
                      {item.notification && (
                        <MDBBadge pill color="danger">
                          {" "}
                        </MDBBadge>
                      )}
                      {item.pill && (
                        <MDBBadge className="ml-2" pill color="light">
                          {item.pill}
                        </MDBBadge>
                      )}
                    </MDBNavLink>
                  </MDBNavItem>
                );
              } else {
                return null;
              }
            })}
        </MDBNav>
        {globalState ? (
          <div className="card p-3 pt-4 tab-content">
            {this.state.activeTab === 0 && (
              <OverviewSoftware
                platformData={
                  globalState.fetchedUser &&
                  globalState.fetchedUser.platformData
                }
              />
            )}
            {this.state.activeTab === 1 && (
              <Projects
                repoList={
                  globalState.fetchedUser &&
                  globalState.fetchedUser.platformData.profile.repositories
                }
              />
            )}
            {this.state.activeTab === 5 && <Talks />}
          </div>
        ) : (
          <p>Loading</p>
        )}
      </MDBContainer>
    );
  }
}

export default ProfileContent;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
