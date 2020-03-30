//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBRow, MDBCol } from "mdbreact";

import axios from 'axios';

// Get pages
const GET_PAGES = (token) => `query pages { pages(token: "${token}") { urlPath } } `;

const snekGraphQL = axios.create({
  baseURL: 'https://engine.snek.at/api/graphiql',
});

class Search extends React.Component {

  state = {
    pages: [],
    usernames: [],
    filter: "",
  }

  componentDidMount = async () => {
    this.getAllPages();
    this.getRequest();
  }

  getRequest = async () => {
    let search = window.location.search;
    if (search && search.includes("?")){
      search = search.substring(1);
      search.split("&").forEach(filter => {
        if (filter.includes("user")){
          filter = filter.replace("user=","");
          this.setState({
            filter
          })
        }
      });
    }
  };

  getAllPages = async () => {
    snekGraphQL
    .post('', { query: GET_PAGES(localStorage.getItem("jwt_snek"))})
    .then(result => {
      if (result.data.data.pages){
        this.addToPages(result.data.data.pages);
      }
    });
  }

  addToPages = (currentPages) => {
    let pages = this.state.pages;
    let usernames = this.state.usernames;

    currentPages.forEach(page => {
      if (page.urlPath != "/registration" && page.urlPath != ""){
        pages.push(page.urlPath);
        usernames.push(page.urlPath.replace("/registration/", ""));
      }
    });
  
    this.setState({
      pages,
      usernames
    });
  }

  render() {
    return (
      <div>
        {this.state.usernames.map((username, key) => {
          if (username.includes(this.state.filter)){
            let link = "u/" + username;
            return <p key={key}><a href={link} target="_self">{username}</a></p>;
          }
        })}
      </div>
    )
  }
}

export default Search;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
