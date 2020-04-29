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
  MDBCardFooter,
  MDBBtn,
  MDBAlert,
  MDBBadge,
  MDBView,
  MDBMask,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBProgress,
  MDBTooltip,
  MDBIcon,
} from "mdbreact";
// Chart.js
import { Doughnut } from "react-chartjs-2";

//> CSS
import "./company.scss";

//> Data
// Configure tabs
const tabs = ["Overview", "People", "Talks", "Locations", "Platforms", "About"];
// Configure dummy data
const data = {
  company: {
    name: "Werbeagentur Christian Aichner",
    description:
      "Advertisement Agency based in Villach-Landskron, Carinthia, Austria. Top Open Source agency in Carinthia.",
    employees: 2,
    email: "contact@aichner-christian.com",
    localRelevance: true,
    verified: true,
    growth: 2, // -2 strong decrease, -1 decrease, 0 stagnant, 1 growth, 2 fast growth
    revenueGrowth: {
      comparedTo: "last year",
      value: 87,
      unit: "%",
    },
    contributors: [
      {
        url: "https://github.com/orgs/aichner/people",
        value: 11,
        platform: "github",
      },
      {
        url: null,
        value: 13,
        platform: "gitlab",
      },
      {
        url: null,
        value: 0,
        platform: "bitbucket",
      },
    ],
    sites: [
      {
        address: "Emailwerkstraße 29",
        country: "Austria",
        zip: "9523",
        city: "Villach-Landskron",
      },
    ],
    isRecruiting: true,
    isOpenSource: true,
    references: {
      github: "https://github.com/aichner",
    },
  },
};

class CompanyPage extends React.Component {
  state = { activeTab: 0 };

  getGrowth = (growth) => {
    switch (growth) {
      case -2:
        return (
          <MDBIcon icon="angle-double-down" className="red-text clickable" />
        );
        break;
      case -1:
        return <MDBIcon icon="angle-down" className="red-text clickable" />;
        break;
      case 1:
        return <MDBIcon icon="angle-up" className="green-text clickable" />;
        break;
      case 2:
        return (
          <MDBIcon icon="angle-double-up" className="green-text clickable" />
        );
        break;
      default:
        break;
    }
  };

  render() {
    const { globalState } = this.props;

    return (
      <div id="company">
        <MDBContainer>
          <MDBRow>
            <MDBCol lg="12">
              <MDBCard>
                <MDBCardBody>
                  <div className="d-flex justify-content-space-between">
                    <div>
                      <p className="lead mb-1">
                        <strong>Finish building your page</strong>
                      </p>
                      <p className="text-muted mb-2">
                        You started strong. Finish editing your page to achieve
                        a better ranking.
                      </p>
                    </div>
                    <MDBBtn color="indigo">Start</MDBBtn>
                  </div>
                  <MDBProgress value={70} className="my-2" />
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="12">
              <MDBCard>
                <MDBCardBody>
                  <MDBRow className="d-flex align-items-center">
                    <MDBCol lg="2">
                      <img
                        src="https://avatars1.githubusercontent.com/u/50574311?s=200"
                        alt="Company logo"
                        className="img-fluid"
                      />
                    </MDBCol>
                    <MDBCol lg="10">
                      <div className="d-flex justify-content-space-between">
                        <div>
                          <p className="lead font-weight-bold mb-1">
                            {data.company.name}
                            {data.company.growth !== 0 && (
                              <MDBTooltip
                                domElement
                                tag="span"
                                material
                                placement="top"
                              >
                                <span className="ml-2">
                                  {this.getGrowth(data.company.growth)}
                                </span>
                                <span>Company growth</span>
                              </MDBTooltip>
                            )}
                          </p>
                          {data.company.verified && (
                            <div className="verified-badge mb-1">
                              <MDBBadge color="success">
                                <MDBIcon icon="check-circle" />
                                Verified
                              </MDBBadge>
                            </div>
                          )}
                          <p className="text-muted mb-1">
                            {data.company.description}
                          </p>
                        </div>
                        <div className="d-flex">
                          <a href={`mailto:${data.company.email}`}>
                            <MDBBtn color="indigo" size="md">
                              Contact
                            </MDBBtn>
                          </a>
                          <MDBBtn color="green" size="md">
                            Follow
                          </MDBBtn>
                        </div>
                      </div>
                      <div>
                        {data.company.isRecruiting && (
                          <MDBBadge color="indigo">
                            <MDBIcon icon="users" />
                            Recruiting
                          </MDBBadge>
                        )}
                        {data.company.employees >= 1 &&
                          data.company.employees < 5 && (
                            <MDBBadge color="primary">1-5 Employees</MDBBadge>
                          )}
                        {data.company.employees >= 5 &&
                          data.company.employees < 20 && (
                            <MDBBadge color="primary">5-20 Employees</MDBBadge>
                          )}
                        {data.company.employees >= 20 &&
                          data.company.employees < 100 && (
                            <MDBBadge color="primary">
                              20-100 Employees
                            </MDBBadge>
                          )}
                        {data.company.employees >= 100 && (
                          <MDBBadge color="primary">100+ Employees</MDBBadge>
                        )}
                        {data.company.localRelevance && (
                          <MDBBadge color="primary">
                            <MDBIcon icon="map-marker" />
                            Local relevance
                          </MDBBadge>
                        )}
                        {data.company.isOpenSource && (
                          <a
                            href={data.company.references.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MDBBadge color="elegant-color">
                              <MDBIcon fab icon="github" />
                              Open source
                            </MDBBadge>
                          </a>
                        )}
                      </div>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
                <MDBCardFooter className="px-4 py-3">
                  <div className="stats d-flex">
                    {data.company.revenueGrowth && (
                      <span className="d-inline-block mr-4">
                        <MDBIcon
                          icon="angle-double-up"
                          className="green-text font-weight-bold"
                        />{" "}
                        <span className="font-weight-bold green-text">
                          +{data.company.revenueGrowth.value}
                          {data.company.revenueGrowth.unit}
                        </span>{" "}
                        revenue
                        <br />
                        <small className="text-muted">
                          compared to {data.company.revenueGrowth.comparedTo}
                        </small>
                      </span>
                    )}
                    <span className="d-inline-block mr-4">
                      <MDBIcon
                        icon="building"
                        className="blue-text font-weight-bold"
                      />{" "}
                      Sites
                      <br />
                      <small className="text-muted">
                        {data.company.sites ? data.company.sites.length : 0}{" "}
                        location
                      </small>
                    </span>
                    <span className="d-inline-block mr-4">
                      <MDBIcon
                        icon="code"
                        className="blue-text font-weight-bold"
                      />{" "}
                      Contributors
                      <br />
                      <small className="text-muted">
                        {data.company.contributors && (
                          <>
                            {data.company.contributors.map((contrib, i) => {
                              if (contrib.url) {
                                return (
                                  <a
                                    key={i}
                                    href={contrib.url}
                                    target="_blank"
                                    className="text-muted"
                                    rel="noopener noreferrer"
                                  >
                                    <MDBIcon
                                      fab
                                      icon={
                                        contrib.platform
                                          ? contrib.platform
                                          : "question-circle"
                                      }
                                      className={i !== 0 ? "mr-1 ml-2" : "mr-1"}
                                    />
                                    {contrib.value ? contrib.value : 0}
                                  </a>
                                );
                              } else {
                                return (
                                  <>
                                    <MDBIcon
                                      fab
                                      icon={
                                        contrib.platform
                                          ? contrib.platform
                                          : "question-circle"
                                      }
                                      className={i !== 0 ? "mr-1 ml-2" : "mr-1"}
                                    />
                                    {contrib.value ? contrib.value : 0}
                                  </>
                                );
                              }
                            })}
                          </>
                        )}
                      </small>
                    </span>
                  </div>
                </MDBCardFooter>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="3">
              <MDBCard>
                <MDBCardBody className="p-0 menu">
                  {tabs.map((tab, i) => {
                    return (
                      <div
                        key={i}
                        className={
                          this.state.activeTab === i ? "active" : undefined
                        }
                        onClick={() => this.setState({ activeTab: i })}
                      >
                        {tab}
                      </div>
                    );
                  })}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="9">
              <MDBCard>
                <MDBCardBody></MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default CompanyPage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
