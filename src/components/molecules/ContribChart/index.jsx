//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional
// Charts for displaying user contribution distribution (Chart.js 2)
import { 
  Radar
} from "react-chartjs-2";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer
} from "mdbreact";

class ChartsPage extends React.Component {

  state={
    dataRadar: {
      labels: ["Loading"],
      datasets: [{
        label: "Loading"
      }]
    }
  }

  componentDidMount = () => {
    this.setState({
      dataRadar: {
        labels: ["Code review", "Issues", "Pull request", "Commits"],
        datasets: this.calculateSources()
      },
      dataRadarOptions: {
        responsive: true,
        elements: {
          line: {
            tension: 0
          }
        },
        legend: {
          display: true,
        },
        scale: {
          ticks: {
            beginAtZero: true,
            max: 100,
            min: 0,
            stepSize: 20
          }
        },
        scales: {
            yAxes: [{
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                display: false
              }
            }],
            xAxes: [{
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                beginAtZero: true,
                display: false,
              }
            }]
        }
    }
    });
  }

  calculateSources = () => {
    let totalReviews = 0, totalIssues = 0, totalRequests = 0, totalCommits = 0, totalSources = 1, results = [];

    // Get data points for all sources
    let types = this.props.types.contribs;
    totalReviews = types.codeReviews.share;
    totalIssues = types.issue.share;
    totalRequests = types.pullRequest.share;
    totalCommits = types.commit.share;

    let values = [
      totalReviews,
      totalIssues,
      totalRequests,
      totalCommits
    ];

    results.push({
      label: "GitHub",
      backgroundColor: "rgba(51,51,51,0)",
      borderColor: "rgba(51,51,51,.4)",
      data: values
    });
    
    // Calculate averages
    let avgReviews, avgIssues, avgRequests, avgCommits;

    avgReviews = parseInt(totalReviews) / parseInt(totalSources);
    avgIssues = parseInt(totalIssues) / parseInt(totalSources);
    avgRequests = parseInt(totalRequests) / parseInt(totalSources);
    avgCommits = parseInt(totalCommits) / parseInt(totalSources);

    // Create average data points
    /*results.push({
      label: "Average",
      backgroundColor: "rgba(33, 181, 33, .7)",
      borderColor: "rgba(33, 181, 33, .3)",
      data: [
        avgReviews,
        avgIssues,
        avgReviews,
        avgCommits
      ]
    });*/

    return results;
  }

  render() {
    return (
      <MDBContainer>
        <Radar 
        data={this.state.dataRadar}
        options={this.state.dataRadarOptions}
        />
      </MDBContainer>
    );
  }
}

export default ChartsPage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
