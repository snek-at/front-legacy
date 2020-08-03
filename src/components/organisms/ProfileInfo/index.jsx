//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBBtn,
  MDBBadge,
  MDBView,
  MDBMask,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBIcon,
  MDBTooltip,
} from "mdbreact";
//#endregion

//#region > Components
class SoftwareEngineer extends React.Component {
  state = {};

  componentDidMount = () => {
    const { globalState } = this.props;

    if (this.props.globalState.fetchedUser && !this.state.sources) {
      this.displaySources(globalState.fetchedUser.platformData.profile.sources);
    }
  };

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

  render() {
    const { globalState } = this.props;

    return (
      <div className="social">
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
                  {globalState.fetchedUser.platformData.user.firstName + " "}
                  {globalState.fetchedUser.platformData.user.lastName}
                </>
              )}
          </h4>
          {globalState.fetchedUser &&
            globalState.fetchedUser.platformData.user.settings &&
            globalState.fetchedUser.platformData.user.settings
              .showLocalRanking && (
              <p className="mb-1 text-muted">
                <small>
                  <a href="#!">#3</a> in your region
                </small>
              </p>
            )}
          {globalState.fetchedUser &&
            globalState.fetchedUser.platformData.profile.company && (
              <>
                {globalState.fetchedUser &&
                  globalState.fetchedUser.platformData.user.settings
                    .showCompanyPublic && (
                    <small className="text-muted py-3">
                      {globalState.fetchedUser.platformData.profile.company}
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
          {globalState.fetchedUser &&
            globalState.fetchedUser.platformData.profile.statusMessage && (
              <div className="d-flex pt-3">
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
                  {globalState.fetchedUser.platformData.profile.statusMessage}
                </small>
              </div>
            )}
        </div>
        <div className="py-3 follow text-center">
          <MDBBtn color="green" size="md">
            <MDBIcon icon="plus-circle" className="mr-2" />
            Follow
          </MDBBtn>
          <MDBBtn color="primary" outline size="md">
            <MDBIcon icon="angle-up" className="mr-2" />
            Upvote
          </MDBBtn>
        </div>
        <div className="bg-light py-3 px-2">
          <p>Connected accounts</p>
          <div className="connected mt-2 text-muted">
            <MDBIcon
              fab
              icon="github"
              size="lg"
              className={
                this.state.sources && this.state.sources.includes("github")
                  ? "active"
                  : ""
              }
            />
            <MDBIcon
              fab
              icon="gitlab"
              size="lg"
              className={
                this.state.sources && this.state.sources.includes("gitlab")
                  ? "active"
                  : ""
              }
            />
            <MDBIcon
              fab
              icon="bitbucket"
              size="lg"
              className={
                this.state.sources && this.state.sources.includes("bitbucket")
                  ? "active"
                  : ""
              }
            />
          </div>
          <hr />
          <p>Organisations</p>
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
                        <MDBPopover placement="top" popover clickable key={i}>
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
                                <div className="tag">{org.members.length}</div>
                              )}
                            </div>
                          </MDBBtn>
                          <div>
                            <MDBPopoverHeader>
                              <div>
                                {org.platformName}/
                                <strong className="text-dark">
                                  {org.name}
                                </strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <div>
                                  <small>
                                    {org.members
                                      ? org.members.length
                                      : "Unknown"}{" "}
                                    members
                                  </small>
                                </div>
                                <div className="member-list">
                                  <div>
                                    {org.members &&
                                      org.members.length > 0 &&
                                      org.members
                                        .slice(0, 8)
                                        .map((member, m) => {
                                          return (
                                            <MDBTooltip
                                              domElement
                                              tag="span"
                                              placement="top"
                                              key={m}
                                            >
                                              <a
                                                href={member.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                <img
                                                  src={member.avatarUrl}
                                                  alt={member.username}
                                                />
                                              </a>
                                              <span>{member.username}</span>
                                            </MDBTooltip>
                                          );
                                        })}
                                  </div>
                                  {org.members && org.members.length > 9 && (
                                    <div className="text-muted text-right">
                                      {org.platformName === "github" && (
                                        <a
                                          href={`https://www.github.com/orgs/${org.name}/people`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <small>Show all</small>
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
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
                  {globalState.fetchedUser.platformData.user.username} hasn't
                  joined an organisation yet.
                </small>
              )}
            </div>
          )}
          <hr />
          <p>Top languages</p>
          <div className="px-4">
            <p>Language Chart</p>
          </div>
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
