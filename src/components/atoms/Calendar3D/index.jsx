//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional packages
// Used to display the time in a readable format
import moment from "moment";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBBtn,
  MDBIcon,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
} from "mdbreact";

//> CSS
import "./calendar3d.scss";

class Calendar3D extends React.Component {
  constructor(props) {
    super(props);
    this.myInput = React.createRef();
    this.state = {
      width: 0,
      hue: 0,
    };
  }

  componentDidMount = () => {
    if (this.props.platformData) {
      // Add resize listener
      window.addEventListener("resize", this.updateDimensions);
      this.setState(
        {
          width: this.myInput.current.offsetWidth,
          loading: true,
        },
        () => this.renderIsometrics()
      );
    }
  };

  componentDidUpdate = () => {
    this.renderIsometrics();
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState(
      {
        width: this.myInput.current.offsetWidth,
      },
      () => this.renderIsometrics()
    );
  };

  renderTopStats() {
    let countTotal, averageCount, datesTotal, maxCount, dateBest, contribData;
    if (this.props.year) {
      contribData = this.props.platformData.statistic.years.find(
        (element) => element.year === this.props.year
      );
    } else {
      contribData = this.props.platformData.statistic.current;
    }

    let contributionCalendar = contribData.calendar;

    countTotal = contribData.contributions.total;
    averageCount =
      Math.round(
        (contribData.contributions.total / 365 + Number.EPSILON) * 100
      ) / 100;
    datesTotal =
      moment(contributionCalendar.startDate).format("MMM DD, YYYY") +
      " - " +
      moment(contributionCalendar.endDate).format("MMM DD, YYYY");
    maxCount = contribData.busiestDay.total;
    dateBest = moment(contribData.busiestDay.date).format("MMM DD");

    let html;

    html = `<div class="ic-stats-block ic-stats-top">\n
    <span class="ic-stats-table">\n
    <span class="ic-stats-row">\n
    <span class="ic-stats-label">1 year total\n
    <span class="ic-stats-count">${countTotal}</span>\n
    <span class="ic-stats-average">${averageCount}</span> per day\n
    </span>\n
    <span class="ic-stats-meta ic-stats-total-meta">\n
    <span class="ic-stats-unit">contributions</span>\n
    <span class="ic-stats-date">${datesTotal}</span>\n
    </span>\n
    </span>\n
    <span class="ic-stats-row">\n
    <span class="ic-stats-label">Busiest day\n
    <span class="ic-stats-count">${maxCount}</span>\n
    </span>\n
    <span class="ic-stats-meta">\n
    <span class="ic-stats-unit">contributions</span>\n
    <span class="ic-stats-date">${dateBest}</span>\n
    </span>\n
    </span>\n
    </span>\n
    </span>\n
    </div>`;
    return { __html: html };
  }

  renderBottomStats() {
    let streakLongest, datesLongest, streakCurrent, datesCurrent, contribData;
    if (this.props.year) {
      contribData = this.props.platformData.statistic.years.find(
        (element) => element.year === this.props.year
      );
    } else {
      contribData = this.props.platformData.statistic.current;
    }

    let contributionCalendar = contribData.calendar;

    if (contribData.streak.longest) {
      streakLongest = contribData.streak.longest.totalDays;
      datesLongest =
        moment(contribData.streak.longest.startDate).format("MMM DD, YYYY") +
        " - " +
        moment(contribData.streak.longest.endDate).format("MMM DD, YYYY");
    } else {
      streakLongest = "0";
      datesLongest = "";
    }
    if (contribData.streak.current.id !== -1) {
      streakCurrent = contribData.streak.current.totalDays;
      datesCurrent =
        moment(contribData.streak.current.startDate).format("MMM DD, YYYY") +
        " - " +
        moment(contribData.streak.current.endDate).format("MMM DD, YYYY");
    } else {
      streakCurrent = "0";
      datesCurrent = "";
    }

    let html;

    html = `<div class="ic-stats-block ic-stats-bottom">\n
    <span class="ic-stats-table">\n
    <span class="ic-stats-row">\n
    <span class="ic-stats-label">Longest streak\n
    <span class="ic-stats-count">${streakLongest}</span>\n
    </span>\n
    <span class="ic-stats-meta">\n
    <span class="ic-stats-unit">days</span>\n
    <span class="ic-stats-date">${datesLongest}</span>\n
    </span>\n
    </span>\n
    <span class="ic-stats-row">\n
    <span class="ic-stats-label">Current streak\n
    <span class="ic-stats-count">${streakCurrent}</span>\n
    </span>\n
    <span class="ic-stats-meta">\n
    <span class="ic-stats-unit">days</span>\n
    <span class="ic-stats-date">${datesCurrent}</span>\n
    </span>\n
    </span>\n
    </span>\n
    </div>`;
    return { __html: html };
  }

  renderIsometrics = async () => {
    const obelisk = require("obelisk.js");

    // Create a canvas 2D point for pixel view world
    let point = new obelisk.Point(70, 70);

    // Create view instance to nest everything
    // Canvas could be either DOM or jQuery element
    let pixelView = new obelisk.PixelView(this.context, point);
    pixelView.clear();

    // Get contributions of the selected year
    let contribData;
    if (this.props.year) {
      contribData = this.props.platformData.statistic.years.find(
        (element) => element.year === this.props.year
      );
    } else {
      contribData = this.props.platformData.statistic.current;
    }

    let contributions = contribData.calendar;

    // Define basic variables
    let SIZE = 2 * Math.round(this.state.width / 80 / 2);
    if (SIZE <= 8) {
      SIZE = 8;
    }
    let MAXHEIGHT = 100;
    let x = 0;
    let y = 0;
    let maxCount = 0; // Max number of contributions / day in the last year

    let values = [];

    contributions.weeks.map((week, wkey) => {
      values[wkey] = [];
      week.days.map((day, dkey) => {
        // Get max number of contributions
        if (day.total > maxCount) {
          maxCount = day.total;
        }
        values[wkey][dkey] = day;
      });
    });

    values.map((week, wi) => {
      week.map((day, di) => {
        // Normalize the values to achieve even distribution
        let cubeHeight = 3;
        if (maxCount > 0) {
          cubeHeight += parseInt((MAXHEIGHT / maxCount) * day.total);
        }

        // Offsets
        let x = wi;
        let y = di;

        // Create cube dimension and color instance
        let fill = day.color;
        let color = new obelisk.CubeColor().getByHorizontalColor(
          parseInt("0x" + fill.replace("#", ""))
        );

        // ANIMATION TOGGLE for kleberbaum to play with
        const animated = false;

        if (animated) {
          var animHeight = 3;

          function draw() {
            let dimension = new obelisk.CubeDimension(SIZE, SIZE, animHeight);
            let p3d = new obelisk.Point3D(SIZE * x, SIZE * y, 0);
            let cube = new obelisk.Cube(dimension, color, false);

            // Render cube primitive into view
            pixelView.renderObject(cube, p3d);
            if (animHeight < cubeHeight) {
              if (parseInt((MAXHEIGHT / maxCount) * day.total) > 0) {
                animHeight += 1;
              } else {
                animHeight = 1;
              }
            }
            // Animations
            requestAnimationFrame(draw);
          }
          draw();
        } else {
          let dimension = new obelisk.CubeDimension(SIZE, SIZE, cubeHeight);
          let p3d = new obelisk.Point3D(SIZE * x, SIZE * y, 0);
          let cube = new obelisk.Cube(dimension, color, false);

          // Render cube primitive into view
          pixelView.renderObject(cube, p3d);
        }
      });
    });
    if (this.state.loading) {
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    console.log(this.state.loading);
    return (
      <div id="calendar3d">
        {this.props.platformData && this.state.width > 500 && (
          <>
            <div dangerouslySetInnerHTML={this.renderTopStats()} />
            <div dangerouslySetInnerHTML={this.renderBottomStats()} />
          </>
        )}
        <div ref={this.myInput}>
          <canvas
            ref={(c) => (this.context = c)}
            width={this.state.width}
            height="350"
          ></canvas>
        </div>
      </div>
    );
  }
}

export default Calendar3D;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
