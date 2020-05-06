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
  MDBTimeline,
  MDBTimelineStep,
} from "mdbreact";
// Chart.js
import { Doughnut, HorizontalBar } from "react-chartjs-2";

//> CSS
import "./company.scss";

//> Data
// Base
const googleMapsBaseURL = "https://www.google.at/maps/place/";
// Configure tabs
const tabs = [
  "Overview",
  "People",
  "Talks",
  "Locations",
  "Platforms",
  "Milestones",
  "About",
];
// Configure dummy data
const data = {
  milestones: [
    { date: "11.11.2017", name: "First employee", icon: "user-circle" },
    { date: "20.09.2017", name: "Foundation", icon: "fire-alt" },
  ],
  platforms: [
    {
      name: "facebook",
      url: "https://www.facebook.com/werbeagentur.aichner",
      data: { followers: 323, avgLikes: 12 },
    },
    {
      name: "instagram",
      url: "https://www.instagram.com/aichnerchristian/",
      data: { followers: 2713, avgLikes: 142 },
    },
    {
      name: "linkedin",
      url: "https://www.linkedin.com/company/19205978",
      data: { followers: 2, avgLikes: 0 },
    },
  ],
  employees: [
    {
      full_name: "Christian Aichner",
      position: "CEO / Founder",
      birthdate: "21.09.1998",
      joined: "23.09.2017",
      country: "Austria",
      school: "HTL Villach",
      study: "Mediatechnology",
      tasks: [
        "JavaScript",
        "ReactJS",
        "HTML",
        "CSS",
        "Leadership",
        "Project Management",
        "Corporate management",
        "Graphics Design",
        "Filmmaking",
      ],
    },
    {
      full_name: "Luca Allmaier",
      position: "Social Media Manager",
      birthdate: null,
      joined: "01.05.2020",
      country: "Austria",
      school: "HTL Villach",
      study: "Mediatechnology",
      tasks: ["Graphics Design", "Social Media", "Customer retention"],
    },
    {
      full_name: "Nico Kleber",
      position: "Social flexing expert",
      birthdate: null,
      joined: "06.06.2019",
      country: "Canada",
      school: null,
      study: null,
      tasks: null,
    },
  ],
  company: {
    name: "Werbeagentur Christian Aichner",
    description:
      "Advertisement Agency based in Villach-Landskron, Carinthia, Austria. Top Open Source agency in Carinthia.",
    employees: 3, // Number of employees including founder (min. value: 1)
    vat: {
      id: "ATU72504738",
      verified: true,
    },
    email: "contact@aichner-christian.com", // Company contact email
    localRelevance: true, // Is the company present in local media and / or well known?
    verified: true, // Verified badge
    growth: 2, // -2 strong decrease, -1 decrease, 0 stagnant, 1 growth, 2 fast growth
    revenueGrowth: {
      comparedTo: "last year", // last year, last quarter, last month
      value: 87, // Rate of growth
      unit: "%", // Is the rate of growth in %, €, ...?
    },
    contributors: [
      {
        url: "https://github.com/orgs/aichner/people", // URL to people overview
        value: 11, // Number of contributors
        platform: "github", // Platform for displaying icon (https://mdbootstrap.com/docs/react/content/icons-list/)
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
    isRecruiting: true, // Is the company actively searching for new employees?
    isOpenSource: true, // Is the company developing open source or is some of its software open source?
    references: {
      github: "https://github.com/aichner",
    },
  },
};

class CompanyPage extends React.Component {
  state = {
    activeTab: 0,
    dataHorizontal: {
      labels: ["Austria", "Canada"],
      datasets: [
        {
          label: "Employees per country",
          data: [2, 1],
          fill: false,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
          borderWidth: 1,
        },
      ],
    },
  };

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
                    <div>
                      <MDBBtn color="indigo" outline>
                        <MDBIcon icon="eye" />
                        View as public
                      </MDBBtn>
                      <MDBBtn color="indigo">Start</MDBBtn>
                    </div>
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
                                  <React.Fragment key={i}>
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
                                  </React.Fragment>
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
                <MDBCardBody>
                  {this.state.activeTab === 0 && (
                    <div>
                      <h2 className="font-weight-bold">Overview</h2>
                      <p className="text-muted">
                        Charts to be added when data is available.
                      </p>
                      <MDBTimeline>
                        {data.milestones.map((milestone, i) => {
                          return (
                            <MDBTimelineStep
                              key={i}
                              icon={milestone.icon}
                              color={milestone.color}
                              inverted={i % 2 ? true : false}
                            >
                              <h4 className="font-weight-bold">
                                {milestone.name}
                              </h4>
                              <p className="text-muted mt-3">
                                <MDBIcon icon="clock" aria-hidden="true" />{" "}
                                {milestone.date}
                              </p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit, sed do eiusmod tempor incididunt ut labore
                              et dolore magna aliqua. Ut enim ad minim veniam,
                              quis nostrud exercitation ullamco laboris nisi ut
                              aliquip ex ea commodo consequat.
                            </MDBTimelineStep>
                          );
                        })}
                      </MDBTimeline>
                    </div>
                  )}
                  {this.state.activeTab === 1 && (
                    <div>
                      <MDBRow>
                        <MDBCol md="6">
                          <p className="lead">
                            {data.company.employees} employees
                          </p>
                        </MDBCol>
                        <MDBCol md="6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search for employees"
                          />
                        </MDBCol>
                      </MDBRow>
                      <div className="charts my-4">
                        <HorizontalBar
                          data={this.state.dataHorizontal}
                          options={{
                            responsive: true,
                            scales: {
                              xAxes: [
                                {
                                  stacked: true,
                                  ticks: {
                                    min: 0,
                                    stepSize: 1,
                                  },
                                },
                              ],
                            },
                          }}
                          height="100"
                        />
                      </div>
                      <MDBRow>
                        {data.employees.map((employee, i) => {
                          return (
                            <MDBCol md="4" key={i}>
                              <MDBCard>
                                <MDBCardBody>
                                  <p className="font-weight-bold mb-0 d-inline-block clickable blue-text">
                                    {employee.full_name}
                                  </p>
                                  <p className="text-muted">
                                    {employee.position}
                                  </p>
                                  {employee.joined && (
                                    <p className="mb-0">
                                      <small>Joined {employee.joined}</small>
                                    </p>
                                  )}
                                </MDBCardBody>
                                <MDBCardFooter className="p-0">
                                  <MDBBtn
                                    color="green"
                                    className="w-100 h-100 m-0"
                                  >
                                    Follow
                                  </MDBBtn>
                                </MDBCardFooter>
                              </MDBCard>
                            </MDBCol>
                          );
                        })}
                      </MDBRow>
                    </div>
                  )}
                  {this.state.activeTab === 2 && (
                    <div>To be integrated together with talks tab</div>
                  )}
                  {this.state.activeTab === 3 && (
                    <div>
                      <MDBRow>
                        <MDBCol md="6">
                          <p className="lead">
                            {data.company.sites.length}{" "}
                            {data.company.sites.length > 1 ? "sites" : "site"}
                          </p>
                        </MDBCol>
                        <MDBCol md="6">
                          {data.company.sites.length > 1 && (
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search for sites"
                            />
                          )}
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        {data.company.sites &&
                          data.company.sites.map((site, i) => {
                            return (
                              <MDBCol md="5" key={i}>
                                <MDBCard>
                                  <MDBCardBody>
                                    <div className="d-flex justify-content-space-between">
                                      <p className="font-weight-bold mb-1">
                                        {site.country}
                                      </p>
                                      <MDBBadge color="indigo">
                                        Main site
                                      </MDBBadge>
                                    </div>
                                    <p>
                                      {site.address}
                                      <br />
                                      {site.zip}, {site.city}
                                    </p>
                                  </MDBCardBody>
                                  <MDBCardFooter className="p-0">
                                    <a
                                      href={`${googleMapsBaseURL}${site.address},+${site.zip},+${site.city}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <MDBBtn
                                        color="white"
                                        className="w-100 h-100 m-0"
                                        size="lg"
                                      >
                                        <MDBIcon fab icon="google" />
                                        Open on Google Maps
                                      </MDBBtn>
                                    </a>
                                  </MDBCardFooter>
                                </MDBCard>
                              </MDBCol>
                            );
                          })}
                      </MDBRow>
                    </div>
                  )}
                  {this.state.activeTab === 4 && (
                    <div>
                      <MDBRow>
                        {data.platforms.map((platform, i) => {
                          return (
                            <MDBCol md="4" key={i}>
                              <a
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MDBCard>
                                  <MDBCardBody>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <MDBIcon
                                        fab
                                        icon={platform.name}
                                        size="lg"
                                      />
                                      <p className="m-0 text-muted">
                                        {platform.data.followers} followers
                                        <br />
                                        {platform.data.avgLikes} average likes
                                        <br />
                                        {(
                                          (platform.data.avgLikes * 100) /
                                          platform.data.followers
                                        ).toFixed(2)}
                                        % engagement
                                      </p>
                                    </div>
                                  </MDBCardBody>
                                </MDBCard>
                              </a>
                            </MDBCol>
                          );
                        })}
                        <MDBCol md="4">
                          <MDBBtn color="green">
                            <MDBIcon icon="plus-circle" />
                            Add platform
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>
                    </div>
                  )}
                  {this.state.activeTab === 5 && <div>Milestone tab</div>}
                  {this.state.activeTab === 6 && (
                    <div>
                      <p className="lead font-weight-bold">
                        {data.company.name}
                      </p>
                      <p>
                        {data.company.sites[0].address}
                        <br />
                        {data.company.sites[0].zip} {data.company.sites[0].city}
                      </p>
                      <p>
                        <strong>VAT identification number</strong>
                        <br />
                        {data.company.vat ? (
                          <>
                            {data.company.vat.id}
                            {data.company.vat.verified ? (
                              <>
                                {" "}
                                <span className="verified-badge">
                                  <MDBBadge>Verified</MDBBadge>
                                </span>
                              </>
                            ) : (
                              <>
                                {" "}
                                <span className="unverified-badge">
                                  <MDBBadge>Not verified</MDBBadge>
                                </span>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <MDBBadge color="indigo" className="z-depth-0">
                              Not eligible
                            </MDBBadge>
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </MDBCardBody>
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
