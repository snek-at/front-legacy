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

class ProfileContent extends React.Component {
  state = {
    activeHorizontalItem: 0,
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
        pill: this.props.projectCount ? this.props.projectCount : false,
        notification: false
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
  };

  toggleHorizontal = (tab) => (e) => {
    if (this.state.activeHorizontalItem !== tab) {
      this.setState({
        activeHorizontalItem: tab
      });
    }
  };

  render() {
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
                        onClick={this.toggleHorizontal(key)}
                        className={this.state.activeHorizontalItem === key ? "seriouslyActive" : ""}
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
          <MDBTabContent
            className="card"
            activeItem={this.state.activeHorizontalItem}
          >
            {this.props.children}
          </MDBTabContent>
        </MDBContainer>
    );
  }
}

export default ProfileContent;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
