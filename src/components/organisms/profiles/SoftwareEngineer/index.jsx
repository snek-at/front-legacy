//> React
// Contains all the functionality necessary to define React components
import React, { lazy, Suspense } from "react";
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

//> Components
const LanguageDoughnut = lazy(() => import("../../../atoms/LanguageDoughnut"));
const ProfileContent = lazy(() => import("../../../organisms/ProfileContent"));
const Projects = lazy(() => import("../../../organisms/tabs/Projects"));
const OverviewSoftware = lazy(() =>
  import("../../../organisms/tabs/OverviewSoftware")
);
const Settings = lazy(() => import("../../../molecules/modals/Settings"));

//> CSS
// This file uses the SCSS of the Profile Page

class SoftwareEngineer extends React.Component {
  state = {
    showSettings: false,
  };

  componentDidMount = () => {
    console.log("########## SOFTWARE ###########");
    console.log(this.state);

    const { globalState } = this.props;

    if (this.props.globalState.fetchedUser && !this.state.sources) {
      this.displaySources(globalState.fetchedUser.platformData.profile.sources);
    }
  };

  componentWillReceiveProps(nextProps) {
    for (const index in nextProps) {
      if (nextProps[index] !== this.props[index]) {
        console.log(index, this.props[index], "-->", nextProps[index]);
      }
    }
  }

  displaySources = (sources) => {
    let res = sources.map((source, i) => {
      switch (source.source) {
        case "github":
          return "github";
        case "gitlab":
          return "gitlab";
        case "bitbucket":
          return "bitbucket";
        default:
          return false;
      }
    });
    this.setState({
      sources: res,
    });
  };

  handleSettingsClose = () => {
    if (this.state.showSettings) {
      this.setState({
        showSettings: false,
      });
    }
  };

  render() {
    const { globalState } = this.props;
    console.log(globalState);

    if (globalState.loading && !globalState.fetchedUser)
      return <Redirect to="/" />;

    return (
      <>
        <MDBContainer id="profile" className="py-3">
          <MDBRow>
            <MDBCol md="3" className="social">
              <MDBView>
                <img
                  className="img-fluid main-avatar"
                  src={
                    globalState.fetchedUser &&
                    globalState.fetchedUser.platformData.profile.avatarUrl
                  }
                />
                <MDBMask />
              </MDBView>
              <div className="bg-elegant py-3 px-3">
                <h4 className="mb-0">
                  {globalState.fetchedUser &&
                    globalState.fetchedUser.platformData.user.firstName &&
                    globalState.fetchedUser.platformData.user.lastName && (
                      <>
                        {globalState.fetchedUser.platformData.user.firstName +
                          " "}
                        {globalState.fetchedUser.platformData.user.lastName}
                      </>
                    )}
                </h4>

                {globalState.fetchedUser &&
                  globalState.fetchedUser.platformData.profile.company && (
                    <>
                      {globalState.fetchedUser &&
                        globalState.fetchedUser.platformData.user.settings
                          .showCompanyPublic && (
                          <small className="text-muted py-3">
                            {
                              globalState.fetchedUser.platformData.profile
                                .company
                            }
                          </small>
                        )}
                    </>
                  )}
                <div className="badges">
                  {globalState.fetchedUser &&
                    globalState.fetchedUser.accessories.badges && (
                      <>
                        {globalState.fetchedUser.accessories.badges.bids.map(
                          (bid, i) => {
                            switch (bid) {
                              case "6403bf4d17b8472735a93b71a37e0bd0":
                                return (
                                  <MDBBadge color="secondary-color" key={i}>
                                    Alpha
                                  </MDBBadge>
                                );
                            }
                          }
                        )}
                      </>
                    )}
                </div>
                <div className="connected mt-2 text-muted">
                  <MDBIcon
                    fab
                    icon="github"
                    size="lg"
                    className={
                      this.state.sources &&
                      this.state.sources.includes("github")
                        ? "active"
                        : ""
                    }
                  />
                  <MDBIcon
                    fab
                    icon="gitlab"
                    size="lg"
                    className={
                      this.state.sources &&
                      this.state.sources.includes("gitlab")
                        ? "active"
                        : ""
                    }
                  />
                  <MDBIcon
                    fab
                    icon="bitbucket"
                    size="lg"
                    className={
                      this.state.sources &&
                      this.state.sources.includes("bitbucket")
                        ? "active"
                        : ""
                    }
                  />
                </div>
                {globalState.fetchedUser &&
                  globalState.fetchedUser.platformData.user.settings &&
                  globalState.fetchedUser.platformData.user.settings
                    .showLocalRanking && (
                    <p className="mb-1 mt-1">
                      <a href="#!">#3</a> in your region
                    </p>
                  )}
                {globalState.fetchedUser &&
                globalState.fetchedUser.selectedUser !== globalState.user ? (
                  <div className="mt-2">
                    {true ? (
                      <MDBBtn color="green" className="mx-0 px-4" size="md">
                        <MDBIcon icon="plus-circle" className="mr-2" />
                        Follow
                      </MDBBtn>
                    ) : (
                      <MDBBtn color="green" className="mx-0 px-4" size="md">
                        <MDBIcon icon="check" className="mr-2" />
                        Following
                      </MDBBtn>
                    )}
                  </div>
                ) : (
                  <div className="mt-2">
                    <MDBBtn
                      color="grey"
                      className="mx-0 px-4 w-100"
                      size="md"
                      onClick={() => this.setState({ showSettings: true })}
                    >
                      <MDBIcon icon="cogs" className="mr-1" />
                      Settings
                    </MDBBtn>
                  </div>
                )}
              </div>
              <div className="bg-light py-3 px-2">
                {globalState.fetchedUser &&
                  globalState.fetchedUser.platformData.profile
                    .statusMessage && (
                    <>
                      {globalState.fetchedUser.platformData.profile
                        .statusEmojiHTML && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              globalState.fetchedUser.platformData.profile
                                .statusEmojiHTML,
                          }}
                        />
                      )}
                      <small className="px-1">
                        {
                          globalState.fetchedUser.platformData.profile
                            .statusMessage
                        }
                      </small>
                    </>
                  )}
                <hr />
                <p>My organisations</p>
                {globalState.fetchedUser && (
                  <div
                    className={
                      globalState.fetchedUser.platformData.profile.organizations
                        .length >= 5
                        ? "orgs text-center"
                        : "orgs"
                    }
                  >
                    {globalState.fetchedUser.platformData.profile.organizations
                      .length > 0 ? (
                      <>
                        {globalState.fetchedUser.platformData.profile.organizations.map(
                          (org, i) => {
                            return (
                              <MDBPopover
                                placement="top"
                                popover
                                clickable
                                key={i}
                              >
                                <MDBBtn color="link">
                                  <div className="org">
                                    {org.avatarUrl ? (
                                      <img src={org.avatarUrl} alt={org.name} />
                                    ) : (
                                      <MDBIcon
                                        icon="sitemap"
                                        className="text-muted"
                                        size="lg"
                                      />
                                    )}
                                    {org.members && (
                                      <div className="tag">
                                        {org.members.length}
                                      </div>
                                    )}
                                  </div>
                                </MDBBtn>
                                <div>
                                  <MDBPopoverHeader>
                                    {org.name}
                                    <br />
                                    <small>
                                      {org.members
                                        ? org.members.length
                                        : "Unknown"}{" "}
                                      members
                                    </small>
                                  </MDBPopoverHeader>
                                  <MDBPopoverBody>
                                    <p className="my-2">{org.description}</p>
                                    <a
                                      href={org.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Show more
                                      <MDBIcon
                                        icon="external-link-alt"
                                        className="ml-1"
                                      />
                                    </a>
                                  </MDBPopoverBody>
                                </div>
                              </MDBPopover>
                            );
                          }
                        )}
                      </>
                    ) : (
                      <small>
                        {globalState.fetchedUser.platformData.user.username}{" "}
                        hasn't joined an organisation yet.
                      </small>
                    )}
                  </div>
                )}
                <hr />
                <p>My top languages</p>
                <div className="px-4">
                  {globalState.fetchedUser.platformData.statistic.languages && (
                    <Suspense fallback={<div>Loading...</div>}>
                      <LanguageDoughnut
                        data={
                          globalState.fetchedUser.platformData.statistic
                            .languages
                        }
                      />
                    </Suspense>
                  )}
                </div>
              </div>
            </MDBCol>
            <MDBCol md="9" className="content p-0">
              <Suspense fallback={<div>Loading...</div>}>
                <ProfileContent
                  projectCount={
                    globalState.fetchedUser &&
                    globalState.fetchedUser.platformData.profile.repositories
                      .length
                  }
                >
                  <OverviewSoftware
                    id={0}
                    platformData={
                      globalState.fetchedUser &&
                      globalState.fetchedUser.platformData
                    }
                  />
                  <Projects
                    id={1}
                    repoList={
                      globalState.fetchedUser &&
                      globalState.fetchedUser.platformData.profile.repositories
                    }
                  />
                </ProfileContent>
              </Suspense>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        {this.state.showSettings && (
          <Suspense fallback={<div>Loading...</div>}>
            <Settings {...this.props} closeModal={this.handleSettingsClose} />
          </Suspense>
        )}
      </>
    );
  }
}

export default SoftwareEngineer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
