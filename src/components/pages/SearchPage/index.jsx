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
  MDBProgress,
} from "mdbreact";

class Search extends React.Component {
  state = {
    pages: [],
    users: [],
    software: [],
    media: [],
    charFilter: "",
    categoryFilter: "",
  };

  componentDidMount() {
    console.log("######GLOBAL STATE", this.props.globalState);
    console.log("match", this.props.match);

    /**
     * Check global state due to duplicate site call
     */
    if(this.props.globalState.all_usernames){
      console.log(this.props.globalState)
      this.filterAllUsernames();
    }
  }

  /**
   * Extract get parameters of url
   */
  getParams(location) {
    const searchParams = new URLSearchParams(location.search);
    console.log(location.search, searchParams)
    return {
      q: searchParams.get("q"),
      type: searchParams.get("type") || "",
    };
  }

  getAllPages() {}

  componentWillMount = () => {
    // this.getRequest();
    // this.getAllPages();
    console.log("####### SEARCH WILL MOUNT");
    //this.props.getAllPageUrls();
  };

  // componentDidUpdate = async () => {
  //   // let search = window.location.search;
  //   // search = search.replace("?");
  //   // search.split("&").forEach(filter => {
  //   //   if (filter.includes("type=")){
  //   //     filter = filter.replace("type=", "");
  //   //     if (this.state.categoryFilter != filter){
  //   //       window.location.reload();
  //   //     }
  //   //   }
  //   // });
  // }

  //?q="Software"&type=user,software,media,talks
  filterAllUsernames() {
    let params = this.getParams(window.location);
    console.log("##### PARAMS", params)
    let { globalState } = this.props;
    console.log(globalState)
    if (params.q) {
      let users = globalState.all_usernames.filter(username => {
        return username.includes(params.q);
      })
      this.setState({
        users,
        charFilter: params.q,
        categoryFilter: params.type
      })
      console.log(users)
    }
    if (params.type) {
    }
  }

  // getRequest = () => {
  //   let search = window.location.search;
  //   if (search && search.includes("?")) {
  //     search = search.substring(1);
  //     search.split("&").forEach((filter) => {
  //       let categoryFilter = "";
  //       if (filter.includes("q=")) {
  //         filter = filter.replace("q=", "");
  //         this.setState({
  //           charFilter: filter,
  //         });
  //       } else if (filter.includes("type=user")) {
  //         categoryFilter = filter.replace("type=", "");
  //       } else if (filter.includes("type=software")) {
  //         categoryFilter = filter.replace("type=", "");
  //       } else if (filter.includes("type=media")) {
  //         categoryFilter = filter.replace("type=", "");
  //       }
  //       this.setState({
  //         categoryFilter,
  //       });
  //     });
  //   }
  // };

  // getAllPages = async () => {
  //   snekGraphQL
  //     .post("", { query: GET_PAGES(localStorage.getItem("jwt_snek")) })
  //     .then((result) => {
  //       let allPages = result.data.data.pages;
  //       let pages = this.state.pages;
  //       if (allPages) {
  //         allPages.forEach((page) => {
  //           if (page.urlPath != "/registration" && page.urlPath != "") {
  //             pages.push(page.urlPath);
  //           }
  //         });
  //         this.addToValues(pages);
  //         this.setState({
  //           pages,
  //         });
  //       }
  //     });
  // };

  // addToValues = (currentPages) => {
  //   let users = this.state.users;
  //   let categoryFilter = this.state.categoryFilter;
  //   let charFilter = this.state.charFilter;

  //   currentPages.forEach((page) => {
  //     let user = page.replace("/registration/", "");
  //     if (user.includes(charFilter)) {
  //       users.push(user);
  //     }
  //   });
  //   this.setState({
  //     users,
  //   });
  // };

  render() {
    let site = window.location.pathname + window.location.search;
    return (
      <MDBContainer>
        <MDBRow>
          <MDBCol size="3">
            <MDBNav className="flex-column">
              <MDBNavItem className="border">
                <MDBNavLink
                  active
                  to={(site = site.split("&")[0] += "&type=user")}
                >
                  <a href={(site = site.split("&")[0] += "&type=user")}>
                    Users
                    <span className="float-md-right">
                      <span
                        class={
                          this.state.users.length > 0
                            ? "badge badge-pill badge-dark"
                            : "badge badge-pill badge-light"
                        }
                      >
                        {this.state.users.length}
                      </span>
                    </span>
                  </a>
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem className="border">
                <MDBNavLink
                  active
                  to={(site = site.split("&")[0] += "&type=software")}
                >
                  <a href={(site = site.split("&")[0] += "&type=software")}>
                    Software Engineer
                    <span className="float-md-right">
                      <span
                        class={
                          this.state.software.length > 0
                            ? "badge badge-pill badge-dark"
                            : "badge badge-pill badge-light"
                        }
                      >
                        {this.state.software.length}
                      </span>
                    </span>
                  </a>
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem className="border">
                <MDBNavLink
                  active
                  to={(site = site.split("&")[0] += "&type=media")}
                >
                  <a href={(site = site.split("&")[0] += "&type=media")}>
                    Media Engineer
                    <span className="float-md-right">
                      <span
                        class={
                          this.state.media.length > 0
                            ? "badge badge-pill badge-dark"
                            : "badge badge-pill badge-light"
                        }
                      >
                        {this.state.media.length}
                      </span>
                    </span>
                  </a>
                </MDBNavLink>
              </MDBNavItem>
            </MDBNav>
          </MDBCol>
          <MDBCol>
            <MDBTable>
              <MDBTableHead>
                {this.state.categoryFilter == "user" ||
                this.state.categoryFilter == "" ? (
                  <tr>
                    <th>
                      {this.state.users.length > 0 ? (
                        <h1>{this.state.users.length} Users</h1>
                      ) : (
                        <h3>
                          We couldn't find any users with the filter '
                          {this.state.charFilter}' in the category '
                          {this.state.categoryFilter}'
                        </h3>
                      )}
                    </th>
                  </tr>
                ) : null}
                {this.state.categoryFilter == "software" ? (
                  <tr>
                    <th>
                      {this.state.software.length > 0 ? (
                        <h1>{this.state.software.length} Software Engineers</h1>
                      ) : (
                        <h3>
                          We couldn't find any users with the filter '
                          {this.state.charFilter}' in the category '
                          {this.state.categoryFilter}'
                        </h3>
                      )}
                    </th>
                  </tr>
                ) : null}
                {this.state.categoryFilter == "media" ? (
                  <tr>
                    <th>
                      {this.state.media.length > 0 ? (
                        <h1>{this.state.media.length} Media Engineers</h1>
                      ) : (
                        <h3>
                          We couldn't find any users with the filter '
                          {this.state.charFilter}' in the category '
                          {this.state.categoryFilter}'
                        </h3>
                      )}
                    </th>
                  </tr>
                ) : null}
              </MDBTableHead>
              <MDBTableBody>
                {this.state.categoryFilter == "user" ||
                this.state.categoryFilter == ""
                  ? this.state.users.map((value, key) => {
                      let link = "/u/" + value;
                      return (
                        <tr>
                          <td>
                            <a href={link}>{value}</a>
                          </td>
                        </tr>
                      );
                    })
                  : null}
                {this.state.categoryFilter == "software"
                  ? this.state.software.map((value, key) => {
                      let link = "/u/" + value;
                      return (
                        <tr>
                          <td>
                            <a href={link}>{value}</a>
                          </td>
                        </tr>
                      );
                    })
                  : null}
                {this.state.categoryFilter == "media"
                  ? this.state.media.map((value, key) => {
                      let link = "/u/" + value;
                      return (
                        <tr>
                          <td>
                            <a href={link}>{value}</a>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default Search;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
