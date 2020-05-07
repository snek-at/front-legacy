//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBTabPane,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
} from "mdbreact";

//> CSS
import "./talks.scss";

//> Modules
import Upload from "../../../molecules/modals/Upload";

class Talks extends React.Component {
  state = {
    showUpload: false,
    loading: true,
  };

  componentDidMount = () => {
    console.log("Talks mounted");
  };

  handleUploadClose = () => {
    if (this.state.showUpload) {
      this.setState({
        showUpload: false,
      });
    }
  };

  render() {
    // Dummy Data
    let talk = {
      name: "Tle5012b.pdf",
      location: "snek",
      display:
        "https://docs.google.com/viewer?embedded=true&url=https://github.com/Infineon/TLE5012-Magnetic-Angle-Sensor/raw/f07f4812e0637f1668761a0687765fb15d5d4195/docs/Tle5012b.pdf",
      download:
        "https://github.com/Infineon/TLE5012-Magnetic-Angle-Sensor/raw/f07f4812e0637f1668761a0687765fb15d5d4195/docs/Tle5012b.pdf",
      url:
        "https://github.com/Infineon/TLE5012-Magnetic-Angle-Sensor/blob/f07f4812e0637f1668761a0687765fb15d5d4195/docs/Tle5012b.pdf",
      path: "slides/PP_21022020_SNEK.pdf",
      repository: {
        name: "tonic",
        fullName: "snek-at/tonic",
        url: "https://github.com/snek-at",
        avatarUrl: "https://avatars1.githubusercontent.com/u/55870326?v=4",
        owner: "snek-at",
        description:
          "This repository includes an library for Arduino for the TLE5012 Magnetic Angle Sensor with SSC interface.",
      },
      social: {
        likes: 17,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
      },
    };
    let talk1 = {
      name: "Tle5012b.pdf",
      location: "snek",
      display:
        "https://docs.google.com/viewer?embedded=true&url=https://github.com/Infineon/TLE5012-Magnetic-Angle-Sensor/raw/f07f4812e0637f1668761a0687765fb15d5d4195/docs/Tle5012b.pdf",
      download:
        "https://github.com/Infineon/TLE5012-Magnetic-Angle-Sensor/raw/f07f4812e0637f1668761a0687765fb15d5d4195/docs/Tle5012b.pdf",
      url:
        "https://github.com/Infineon/TLE5012-Magnetic-Angle-Sensor/blob/f07f4812e0637f1668761a0687765fb15d5d4195/docs/Tle5012b.pdf",
      path: "slides/PP_21022020_SNEK.pdf",
      repository: {
        name: "tonic",
        fullName: "snek-at/tonic",
        url: "https://github.com/snek-at",
        avatarUrl: "https://avatars1.githubusercontent.com/u/55870326?v=4",
        owner: "snek-at",
        description:
          "This repository includes an library for Arduino for the TLE5012 Magnetic Angle Sensor with SSC interface.",
      },
      social: {
        likes: 17,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
      },
    };
    const talkList = [talk, talk1];

    return (
      <>
        <MDBRow>
          <MDBCol md="10">
            <h3 className="font-weight-bold">Talks</h3>
          </MDBCol>
          <MDBCol md="2">
            <MDBBtn
              color="green"
              size="md"
              onClick={() => this.setState({ showUpload: true })}
            >
              Upload
            </MDBBtn>
          </MDBCol>
        </MDBRow>
        <MDBRow className="talks-list">
          {talkList &&
            talkList.map((talk, i) => {
              return (
                <MDBCol md="6" key={i}>
                  <MDBCard>
                    <a
                      href={"/t/" + talk.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MDBCardHeader className="lead mb-1">
                        {talk.name.length > 25
                          ? talk.name.substring(0, 25) + "..."
                          : talk.name}
                      </MDBCardHeader>
                      <MDBCardBody className="lead">
                        <div className="thumbnail-container">
                          <div className="thumbnail">
                            <iframe src={talk.display} frameBorder="0" />
                          </div>
                        </div>
                      </MDBCardBody>
                      <div className="clearfix" />
                      <MDBCardFooter>
                        {talk1.social && (
                          <span className="d-inline-block mr-4">
                            <MDBIcon
                              icon="thumbs-up"
                              className="green-text font-weight-bold"
                            />{" "}
                            <span className="font-weight-bold green-text">
                              {talk1.social.likes}
                            </span>{" "}
                            likes
                            <br />
                            <small className="text-muted">
                              published on {talk1.social.date}
                            </small>
                          </span>
                        )}
                        {talk1.download && (
                          <a href={talk1.download}>
                            <span className="d-inline-block mr-4">
                              <MDBIcon
                                icon="file-download"
                                className="blue-text font-weight-bold"
                              />{" "}
                              download
                            </span>
                          </a>
                        )}
                        <a
                          href={talk1.repository.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div>
                            <img
                              src={talk.repository.avatarUrl}
                              alt={talk.repository.name}
                            />
                            <small>Owned by {talk.repository.owner}</small>
                          </div>
                        </a>
                      </MDBCardFooter>
                    </a>
                  </MDBCard>
                </MDBCol>
              );
            })}
        </MDBRow>
        {this.state.showUpload && (
          <Upload {...this.props} closeModal={this.handleUploadClose} />
        )}
      </>
    );
  }
}

export default Talks;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
