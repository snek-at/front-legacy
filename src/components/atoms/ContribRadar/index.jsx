//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional
// Charts for displaying user contribution distribution (Chart.js 2)
import { Radar } from "react-chartjs-2";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBContainer } from "mdbreact";

class ChartsPage extends React.Component {
  state = {
    dataRadarOptions: {
      responsive: true,
      elements: {
        line: {
          tension: 0,
        },
      },
      legend: {
        display: false,
      },
      scale: {
        pointLabels: {
          fontSize: 14,
        },
        ticks: {
          beginAtZero: true,
          max: 100,
          min: 0,
          stepSize: 20,
        },
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              beginAtZero: true,
              display: false,
            },
          },
        ],
      },
    },
  };

  componentDidMount = () => {
    // First render chart with current year
    this.calculateSources(null);
  };

  componentWillReceiveProps(nextProps) {
    // Update chart
    this.calculateSources(nextProps.year);
  }

  fillChart = (results) => {
    this.setState({
      dataRadar: {
        labels: ["Code review", "Issues", "Pull request", "Commits"],
        datasets: results,
      },
    });
  };

  calculateSources = (nextPropsYear) => {
    const { statistic } = this.props;
    let totalReviews = 0,
      totalIssues = 0,
      totalRequests = 0,
      totalCommits = 0,
      totalSources = 1,
      year,
      results = [];

    if (nextPropsYear === null) {
      year = this.props.year;
    } else {
      year = nextPropsYear;
    }

    if (year) {
      let selectedYear = statistic.years.find(
        (element) => element.year === year
      );
      totalIssues = selectedYear.contributions.issue.share;
      totalRequests = selectedYear.contributions.pullRequest.share;
      totalCommits = selectedYear.contributions.commit.share;
      totalReviews = selectedYear.contributions.pullRequestReview.share;
    } else {
      let contributions = statistic.current.contributions;
      totalIssues = contributions.issue.share;
      totalRequests = contributions.pullRequest.share;
      totalCommits = contributions.commit.share;
      totalReviews = contributions.pullRequestReview.share;
    }

    let values = [totalReviews, totalIssues, totalRequests, totalCommits];

    results.push({
      label: "GitHub",
      backgroundColor: "rgba(123, 201, 111,.4)",
      borderColor: "rgba(123, 201, 111)",
      data: values,
    });

    // Calculate averages
    let avgReviews, avgIssues, avgRequests, avgCommits;

    avgReviews = parseInt(totalReviews) / parseInt(totalSources);
    avgIssues = parseInt(totalIssues) / parseInt(totalSources);
    avgRequests = parseInt(totalRequests) / parseInt(totalSources);
    avgCommits = parseInt(totalCommits) / parseInt(totalSources);

    this.fillChart(results);
  };

  render() {
    console.log(this.state);
    return (
      <Radar
        data={this.state.dataRadar}
        options={this.state.dataRadarOptions}
        height="100"
      />
    );
  }
}

export default ChartsPage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
