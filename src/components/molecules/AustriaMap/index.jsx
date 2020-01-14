//> React
// Contains all the functionality necessary to define React components
import React from "react";

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

class AustriaMap extends React.Component {
    render() {
        return (
        <div style={wrapperStyles} className={this.props.className}>
            <ComposableMap
            projectionConfig={{ scale: 7000 }}
            style={{
                width: "100%",
                height: "auto",
            }}
            >
            <ZoomableGroup center={[ 13.5501, 47.5162 ]} disablePanning>
                <Geographies geography={mapSelectData}>
                {(geographies, projection) =>
                    geographies.map((geography, i) =>
                    
                        <Geography
                        key={i}
                        geography={geography}
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
                    
                    )
                }
                </Geographies>
                <Markers>
                {markers.map((marker, i) => (
                    <Marker
                    key={i}
                    marker={marker}
                    style={{
                        default: { stroke: "green" },
                        hover: { stroke: "green" },
                        pressed: { stroke: "green" },
                    }}
                    >
                    <g transform="translate(-12, -24)">
                        <path
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeMiterlimit="10"
                        strokeLinejoin="miter"
                        d="M20,9c0,4.9-8,13-8,13S4,13.9,4,9c0-5.1,4.1-8,8-8S20,3.9,20,9z"
                        />
                        <circle
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="square"
                        strokeMiterlimit="10"
                        strokeLinejoin="miter"
                        cx="12"
                        cy="9"
                        r="3"
                        />
                    </g>
                    </Marker>
                ))}
                </Markers>
            </ZoomableGroup>
            </ComposableMap>
        </div>
        )
    }
}

export default AustriaMap;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
