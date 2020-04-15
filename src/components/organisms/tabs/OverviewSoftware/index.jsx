//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBTabPane,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBBadge,
  MDBIcon,
} from "mdbreact";

//> Components
import { Calendar3D, Calendar2D } from "../../../atoms";

//> CSS
import "./overviewsoftware.scss";

class Overview extends React.Component {
  state = {
    selectedYear: undefined,
  };

  render() {
    const { platformData } = this.props;
    return (
      <MDBTabPane tabId={this.props.id} role="tabpanel">
        {platformData && (
          <MDBRow className="text-center text-md-left mb-4">
            {platformData.statistic.languages.map((language, i) => {
              if (i < 6) {
                return (
                  <MDBCol md="4" key={i}>
                    <span className="mb-2 text-muted">
                      <MDBIcon
                        icon="square"
                        className="pr-2"
                        style={{ color: language.color }}
                      />
                      {language.name} <small>{language.share}%</small>
                    </span>
                  </MDBCol>
                );
              }
            })}
          </MDBRow>
        )}
        {true && (
          <>
            <MDBRow className="m-0 p-0">
              <MDBCol md="6 text-left">
                <p className="lead">Pinned</p>
              </MDBCol>
              <MDBCol md="6 text-right">
                <span className="clickable text-muted">Customize</span>
              </MDBCol>
            </MDBRow>
            <MDBRow className="pinned">
              <MDBCol md="4">
                <MDBCard>
                  <MDBCardBody>
                    <div className="text-center">
                      <MDBBadge color="info">Talk</MDBBadge>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-muted">
                        It is okay to love your sister
                      </p>
                    </div>
                    <div>
                      <MDBRow className="mx-1">
                        <MDBCol col="6" className="text-left">
                          <span className="text-muted">
                            <MDBIcon icon="eye" className="mr-1" /> 69
                          </span>
                        </MDBCol>
                        <MDBCol col="6" className="text-right">
                          <span className="clickable text-muted blue-text">
                            More
                          </span>
                        </MDBCol>
                      </MDBRow>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md="4">
                <MDBCard>
                  <MDBCardBody>
                    <div className="text-center">
                      <MDBBadge color="info">Talk</MDBBadge>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-muted">
                        How I learned to hide a secret
                      </p>
                    </div>
                    <div>
                      <MDBRow className="mx-1">
                        <MDBCol col="6" className="text-left">
                          <span className="text-muted">
                            <MDBIcon icon="eye" className="mr-1" /> 23
                          </span>
                        </MDBCol>
                        <MDBCol col="6" className="text-right">
                          <span className="clickable text-muted blue-text">
                            More
                          </span>
                        </MDBCol>
                      </MDBRow>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md="4">
                <MDBCard>
                  <MDBCardBody>
                    <div className="text-center">
                      <MDBBadge color="info">Talk</MDBBadge>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-muted">
                        How to raise your daughter in Alabama
                      </p>
                    </div>
                    <div>
                      <MDBRow className="mx-1">
                        <MDBCol col="6" className="text-left">
                          <span className="text-muted">
                            <MDBIcon icon="eye" className="mr-1" /> 165
                          </span>
                        </MDBCol>
                        <MDBCol col="6" className="text-right">
                          <span className="clickable text-muted blue-text">
                            More
                          </span>
                        </MDBCol>
                      </MDBRow>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md="4">
                <MDBCard>
                  <MDBCardBody>
                    <div className="text-center">
                      <MDBBadge color="primary">Repository</MDBBadge>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-muted">snek-at/front</p>
                    </div>
                    <div>
                      <MDBRow className="mx-1">
                        <MDBCol col="6" className="text-left">
                          <span className="text-muted">
                            <MDBIcon icon="users" className="mr-1" /> 12
                          </span>
                        </MDBCol>
                        <MDBCol col="6" className="text-right">
                          <span className="clickable text-muted blue-text">
                            Open
                          </span>
                        </MDBCol>
                      </MDBRow>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md="4">
                <MDBCard>
                  <MDBCardBody>
                    <div className="text-center">
                      <MDBBadge color="orange">Video</MDBBadge>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-muted">My 2020 showreel</p>
                    </div>
                    <div>
                      <MDBRow className="mx-1">
                        <MDBCol col="6" className="text-left">
                          <span className="text-muted">
                            <MDBIcon icon="eye" className="mr-1" /> 5.430
                          </span>
                        </MDBCol>
                        <MDBCol col="6" className="text-right">
                          <span className="clickable text-muted blue-text">
                            View
                          </span>
                        </MDBCol>
                      </MDBRow>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md="4">
                <MDBCard>
                  <MDBCardBody>
                    <div className="text-center">
                      <MDBBadge color="indigo">Photo</MDBBadge>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-muted">The best picture I ever took</p>
                    </div>
                    <div>
                      <MDBRow className="mx-1">
                        <MDBCol col="6" className="text-left">
                          <span className="text-muted">
                            <MDBIcon icon="eye" className="mr-1" /> 404
                          </span>
                        </MDBCol>
                        <MDBCol col="6" className="text-right">
                          <span className="clickable text-muted blue-text">
                            View
                          </span>
                        </MDBCol>
                      </MDBRow>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </>
        )}
        {platformData &&
          (platformData.user.settings.show3DDiagram ||
            platformData.user.settings.show2DDiagram) && (
            <div className="text-right year-select">
              {platformData.statistic.years.map((year, i) => {
                return (
                  <MDBBtn
                    color="white"
                    key={i}
                    size="md"
                    className={
                      year.year === this.state.selectedYear
                        ? "selected"
                        : undefined
                    }
                    onClick={() => this.setState({ selectedYear: year.year })}
                  >
                    {year.year}
                  </MDBBtn>
                );
              })}
              <MDBBtn
                color="white"
                size="md"
                className={
                  this.state.selectedYear === undefined ? "selected" : undefined
                }
                onClick={() => this.setState({ selectedYear: undefined })}
              >
                Current
              </MDBBtn>
            </div>
          )}
        {platformData && platformData.user.settings.show3DDiagram && (
          <Calendar3D platformData={platformData} year={this.state.selectedYear} />
        )}
        {platformData && platformData.user.settings.show2DDiagram && (
          <Calendar2D platformData={platformData} year={this.state.selectedYear} />
        )}
      </MDBTabPane>
    );
  }
}

export default Overview;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
