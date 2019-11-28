//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Chart.js
// "Material Design for Bootstrap" is using chart.js to generate its charts
import { Radar } from "react-chartjs-2";

class LanguageChart extends React.Component {
  state = {
    dataPolar: {
      datasets: [
        {
          data: [300, 250, 100, 40],
          backgroundColor: [
            "rgba(247, 70, 74, 0.8)",
            "rgba(70, 191, 189, 0.8)",
            "rgba(253, 180, 92, 0.8)",
            "rgba(148, 159, 177, 0.8)"
          ],
          label: "Your top languages"
        }
      ],
      labels: ["JavaScript", "Python", "CSS", "Roff"]
    }
  };

  componentDidMount = () => {
    let languages = this.props.languages.slices;

    let colors = [];
    let labels = [];
    let data = [];

    Object.values(languages).map((language, i) => {
      colors.push(language.color);
      labels.push(language.name);
      data.push(language.share);
    });

    this.setState({
      dataPolar: {
        datasets: [
          {
            data,
            backgroundColor: colors,
            label: "Your top languages"
          }
        ],
        labels
      }
    });
  }

  render() {
    return (
      <>
        <p className="lead font-weight-bold text-center mt-3">
          Your top languages
        </p>
        {this.state.dataPolar &&
          <Radar
            className="w-100 h-auto"
            data={this.state.dataPolar}
            options={
              ({
                responsive: true
              },
              {
                legend: {
                  display: false
                }
              })
            }
          />
        }
      </>
    );
  }
}

export default LanguageChart;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
