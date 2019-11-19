//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBInput,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from "mdbreact";

class SearchBar extends React.Component {
  state = {
    search: "",
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { location } = this.props;
    const { data } = this.props;
    return (
      <>
        <div className="md-form my-0 mx-2">
          <MDBInput
            className="mr-sm-2"
            outline
            maxLength="20"
            value={this.state.search}
            name="search"
            type="search"
            onChange={this.handleChange}
            placeholder="Search"
            aria-label="Search"
          />
          <MDBIcon icon="search" />
        </div>
        {this.state.search &&
        <div className="search-results">
          <MDBListGroup>
          <a 
          href={"https://www.google.com/search?q="+this.state.search}
          target="_blank"
          className="text-muted"
          >
            <MDBListGroupItem><MDBIcon fab icon="google" className="mr-2" />
            {this.state.search}
            </MDBListGroupItem>
          </a>
          </MDBListGroup>
        </div>
        }
      </>
    );
  }
}

export default SearchBar;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
