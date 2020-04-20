//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional
import InstagramEmbed from "react-instagram-embed";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBTabPane,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdbreact";

//> CSS
import "./overviewmedia.scss";

//> Map
// Basic libs
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography,
    Markers,
    Marker,
} from "react-simple-maps"
// Data
import mapSelectData from './world-10m.json';
// Settings
const wrapperStyles = {
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
}

const markers = [
    { name: "Agent 1", coordinates: [13.8506, 46.6086] },
    { name: "Agent 2", coordinates: [13.8496928, 46.6114363 ] },
    { name: "Agent 3", coordinates: [13.1793211, 46.6413315 ] },
    { name: "Agent 4", coordinates: [14.0370715, 46.5629874 ] },
    { name: "Agent 5", coordinates: [13.489387, 46.783450 ] },
]

class Overview extends React.Component {
  state = {};

  render() {
    const { mapData, instagram } = this.props;
    return (
      <MDBTabPane tabId={this.props.id} role="tabpanel">
        <h2 className="font-weight-bold text-center">Portfolio</h2>
        <p className="lead text-center">The places included in my portfolio.</p>
        {mapData ? (
          <div style={wrapperStyles}>
            <ComposableMap
            projectionConfig={{
              scale: 700
            }}
            height="400"
            style={{
                width: "100%",
                height: "auto",
            }}
            >
              <ZoomableGroup center={[ 13.5501, 47.5162 ]} disablePanning>
              <Geographies geography={mapSelectData}>
                {({ geographies, projection }) =>
                  geographies
                    .map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        projection={projection}
                        style={{
                          default: {
                          fill: "#ECEFF1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                          },
                          hover: {
                          fill: "#ECEFF1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                          },
                          pressed: {
                          fill: "#ECEFF1",
                          stroke: "#607D8B",
                          strokeWidth: 0.75,
                          outline: "none",
                          },
                        }}
                      />
                    ))
                }
              </Geographies>
              {markers.map(({ name, coordinates, markerOffset }) => (
                <Marker key={name} coordinates={coordinates}>
                  <circle r={5} fill="#F00" stroke="#fff" strokeWidth={2} />
                </Marker>
              ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>
        ) : (
          <div className="text-center my-5 py-5">
            <div className="spinner-grow text-success" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        <h3 className="text-center mt-4">Check out my Instagram</h3>
        <MDBRow className="text-center">
        
        {instagram.instagramPosts.map((post, i) => (
          <MDBCol md="6" className="mb-5 mt-3">
          <InstagramEmbed
            url={post.url}
            maxWidth={"100%"}
            hideCaption={instagram.hideCaption}
            containerTagName='div'
            injectScript
            onLoading={() => {
              this.setState({["loading"+i]: true})
            }}
            onSuccess={() => {
              this.setState({["loading"+i]: false})
            }}
          />
          {this.state["loading"+i] &&
            <div className="spinner-grow text-success" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          }
          </MDBCol>
        ))}
        </MDBRow>
      </MDBTabPane>
    );
  }
}

export default Overview;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
