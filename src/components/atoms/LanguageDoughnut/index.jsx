//> React
// Contains all the functionality necessary to define React components
import React from "react";
//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBContainer } from "mdbreact";
// Chart.js
import { Doughnut } from "react-chartjs-2";

//> CSS
// This file uses the SCSS of the Profile Page

class LanguageDoughnut extends React.Component {
  state = {};

  componentDidMount = () => {
    this.displayDoughnut(this.props.data);
  };

  increaseBrightness = (hex, percent) => {
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, "");

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length == 3) {
      hex = hex.replace(/(.)/g, "$1$1");
    }

    var r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16);

    return (
      "#" +
      (0 | ((1 << 8) + r + ((256 - r) * percent) / 100))
        .toString(16)
        .substr(1) +
      (0 | ((1 << 8) + g + ((256 - g) * percent) / 100))
        .toString(16)
        .substr(1) +
      (0 | ((1 << 8) + b + ((256 - b) * percent) / 100)).toString(16).substr(1)
    );
  };

  displayDoughnut = (languages) => {
    let dataLabels = [];
    let dataBackground = [];
    let dataBackgroundHover = [];
    let dataData = [];

    languages.map((language, i) => {
      dataLabels.push(language.name);
      if (language.color) {
        dataBackground.push(language.color);
        dataBackgroundHover.push(this.increaseBrightness(language.color, 10));
      } else {
        dataBackground.push("#ffffff");
        dataBackgroundHover.push(this.increaseBrightness("#ffffff", 10));
      }
      dataData.push(language.share);
    });

    if (!this.state.dataDoughnut) {
      this.setState({
        dataDoughnut: {
          labels: dataLabels,
          datasets: [
            {
              data: dataData,
              backgroundColor: dataBackground,
              hoverBackgroundColor: dataBackgroundHover,
            },
          ],
        },
      });
    }
  };

  render() {
    const { data } = this.props;
    console.log(data);

    return (
      <>
        {this.state.dataDoughnut && (
          <Doughnut
            data={this.state.dataDoughnut}
            options={{
              responsive: true,
              legend: {
                display: false,
              },
            }}
            height={300}
          />
        )}
      </>
    );
  }
}

export default LanguageDoughnut;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
