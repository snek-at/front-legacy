//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional libraries
// Time management
import moment from "moment";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBRow, MDBCol } from "mdbreact";

//> Helpers
import changeHue from "../../helpers/changeHue.js";

//> Dummy data
//import dummyData from "./dummydata.js";

//> CSS
import "./calendar3d.scss";

class Calender3D extends React.Component {
  constructor(props) {
    super(props);
    this.myInput = React.createRef();
    this.state = {
      width: 0,
      hue: 0
    };
  }

  updateDimensions = () => {
    this.setState({
      width: this.myInput.current.offsetWidth
    });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  componentDidMount = () => {
    // Add resize listener
    window.addEventListener("resize", this.updateDimensions);
    this.setState({
      width: this.myInput.current.offsetWidth
    }, () => this.renderIsometrics());
  };

  renderTopStats() {
    let countTotal, averageCount, datesTotal, maxCount, dateBest;

    let contribData = this.props.contrib["2019"];
    let contributionCalendar = this.props.calendar.currentYear["2019"];

    countTotal = contributionCalendar.total;
    averageCount = contribData.average;
    datesTotal = moment(new Date()).format("MMM DD, YYYY") + 
    " - " + moment(new Date()).subtract(1, "year'").format("MMM DD, YYYY");
    maxCount = contribData.busiestDay.total;
    dateBest = moment(contribData.busiestDay.date).format("MMM DD");

    // "Oct 7, 2018 - Oct 9, 2019"

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
    let streakLongest, datesLongest, streakCurrent, datesCurrent;

    let contribData = this.props.contrib["2019"];
    let contributionCalendar = this.props.calendar.currentYear["2019"];

    streakLongest = contribData.longestStreak.total;
    datesLongest = moment(contribData.longestStreak.startDate).format("MMM DD, YYYY") 
    + " - " 
    + moment(contribData.longestStreak.endDate).format("MMM DD, YYYY");
    streakCurrent = contribData.currentStreak.total;
    datesCurrent = moment(contribData.currentStreak.startDate).format("MMM DD, YYYY") 
    + " - " 
    + moment(contribData.currentStreak.endDate).format("MMM DD, YYYY");

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

  renderIsometrics = () => {
    const obelisk = require("obelisk.js");

    // Create a canvas 2D point for pixel view world
    let point = new obelisk.Point(70, 70);

    // Create view instance to nest everything
    // Canvas could be either DOM or jQuery element
    let pixelView = new obelisk.PixelView(this.context, point);

    // Get contribs
    let contributions = this.props.calendar.currentYear["2019"];

    // Define basic variables
    let SIZE = 10;
    let MAXHEIGHT = 100;
    let x = 0;
    let y = 0;
    let maxCount = 0; // Max number of contributions / day in the last year

    let values = [];

    contributions.weeks.map((week, wkey) => {
      values[wkey] = [];
      week.contributionDays.map((day, dkey) => {
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
          cubeHeight += parseInt(
            (MAXHEIGHT / maxCount) * day.total
          );
        }

        // Offsets
        let x = wi;
        let y = di;

        // Create cube dimension and color instance
        //let gray = obelisk.ColorPattern.GRAY;
        let fill = day.color;
        let color = new obelisk.CubeColor().getByHorizontalColor(
          parseInt("0x" + fill.replace("#", ""))
        );

        let dimension = new obelisk.CubeDimension(SIZE, SIZE, cubeHeight);
        // Build cube with dimension and color instance
        let p3d = new obelisk.Point3D(SIZE * x, SIZE * y, 0);
        var cube = new obelisk.Cube(dimension, color, false);

        // Render cube primitive into view
        pixelView.renderObject(cube, p3d);
      });
    });
  };

  render() {
    //> Debugging Entry point
    //console.log(this.state);
    return (
      <div id="calendar3d">
        <div dangerouslySetInnerHTML={this.renderTopStats()} />
        <div dangerouslySetInnerHTML={this.renderBottomStats()} />
        <div ref={this.myInput}>
          <canvas
            ref={c => (this.context = c)}
            width={this.state.width}
            height="410"
          ></canvas>
        </div>
      </div>
    );
  }
}
export default Calender3D;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
