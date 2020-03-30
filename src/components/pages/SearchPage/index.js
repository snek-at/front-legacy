//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { 
  MDBNav,
  MDBNavItem,
  MDBNavLink,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBTable,
  MDBTableHead,
  MDBTableBody, 
} from "mdbreact";

import axios from 'axios';

// Get pages
const GET_PAGES = (token) => `query pages { pages(token: "${token}") { urlPath } } `;

const snekGraphQL = axios.create({
  baseURL: 'https://engine.snek.at/api/graphiql',
});

class Search extends React.Component {

  state = {
    pages: [],
    values: [],
    charFilter: "",
    categoryFilter: "",
  }

  componentDidMount = async () => {
    await this.getRequest();
    this.getAllPages();
  }

  getRequest = () => {
    let search = window.location.search;
    if (search && search.includes("?")){
      search = search.substring(1);
      search.split("&").forEach(filter => {
        if (filter.includes("q=")){
          filter = filter.replace("q=","");
          this.setState({
            charFilter: filter
          })
        }
        else if (filter.includes("type=user")){
          filter = filter.replace("type=","");
          this.setState({
            categoryFilter: filter
          })
        }
      });
    }
  };

  getAllPages = async () => {
    snekGraphQL
    .post('', { query: GET_PAGES(localStorage.getItem("jwt_snek"))})
    .then(result => {
      let allPages = result.data.data.pages;
      let pages = this.state.pages;
      if (allPages){
        allPages.forEach(page => {
          if (page.urlPath != "/registration" && page.urlPath != ""){
            pages.push(page.urlPath);
          }
        });
        this.addToValues(pages);
        this.setState({
          pages
        })
      }
    });
  }

  addToValues = (currentPages) => {
    let values = this.state.values;
    let categoryFilter = this.state.categoryFilter;
    let charFilter = this.state.charFilter;

    currentPages.forEach(page => {
      let value = page.replace("/registration/", "");
      if (value.includes(charFilter)){
        values.push(value);
      }
    });
    this.setState({
      values
    });
  }

  render() {
    let site = window.location.pathname + window.location.search;
    return (
      <MDBContainer>
        <MDBRow>
          <MDBCol size="3">
            <MDBNav className="flex-column">
              <MDBNavItem>
                <MDBNavLink active to={site = site.split("&")[0] += "&type=user"}>Users</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to={site = site.split("&")[0] += "&type=software"}>Software Engineer</MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink to={site = site.split("&")[0] += "&type=media"} >Media Engineer</MDBNavLink>
              </MDBNavItem>
            </MDBNav>
          </MDBCol>
          <MDBCol>
            <MDBTable>
              <MDBTableHead>
                <tr>
                  <th><h1>{this.state.values.length} Users</h1></th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {this.state.values.map((value, key) => {
                    let link = "u/" + value;
                    return <tr><td><a href={link}>{value}</a></td></tr>;
                })}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    )
  }
}

export default Search;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
