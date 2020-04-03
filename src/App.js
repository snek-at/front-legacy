//> React
// Contains all the functionality necessary to define React components
import React from "react";

import { toast, ToastContainer } from "mdbreact";
// DOM bindings for React Router
import { BrowserRouter as Router } from "react-router-dom";

//> Components
import { Navbar, Footer } from "./components/organisms";
import { ScrollToTop } from "./components/atoms";

//> Routes
import Routes from "./Routes";

import sha256 from "js-sha256";

//> Intel
import { Intel } from "snek-intel";

class App extends React.Component {
  state = {
    logged: false,
    username: undefined,
    gitlab_servers: undefined,
    user: undefined
  };

  constructor() {
    super();
    this.intel = new Intel();
    this.session = this.intel.snekclient.session;
  }

  async componentDidMount() {
    /**
     * Begin Session:
     * Start a new session based on authentication history.
     * New site access will lead to a anonymous login.
     */
    await this.session.begin()

    /**
     * Fetch Gitlab server:
     * Get all available Gitlab server for registration.
     */
    this.fetchGitLabServers();
  }

  /**
   * Props functions
   * #DA: See Documentation "Data Management States"
   */

  /**
   * Authentication / Registration Tasks
   */

  login = async (username, password) => {
    this.session
      .begin({
        username,
        password
      })
      .then(res => {
        console.log(res);
        this.setState({
          loading: false,
          logged: true,
          user: res.username
        });
      })
      .catch(err => {
        console.error(err);
      });

    // console.log(this.session.tasks.user.whoami())

    this.setState({});
  };

  anonymousLogin = async () => {
    await this.session.begin();
  };

  logout = () => {
    this.setState(
      {
        loading: false,
        logged: false,
        user: undefined
      },
      () => {
        this.session.end().then(() => {
          this.anonymousLogin();
        });
      }
    );
  };

  registerUser = values => {
    this.session.tasks.user
      .registration(values)
      .then(res => {
        console.log(res);
        if (res.message === "FAIL") {
          console.log("warn", "All fields have to be filled!");
        } else {
          this.login(values.username, values.password);
        }
      })
      .catch(error => {
        console.log(error);
        if (error.message.includes("Authentication required")) {
          console.log("success", " Welcome to SNEK!");
        } else if (error.message.includes("Duplicate entry")) {
          console.log("warn", " Username already taken!");
        } else {
          console.error("error", error);
        }
      });
  };

  /**
   * Data Tasks
   */

  getData = async username => {
    this.session.tasks.user
      .profile("/registration/" + username)
      .then(({ data }) => {
        if (data.profile.verified) {
          // Redirect and login
          let platformData = JSON.parse(data.profile.platformData);
          let sources = JSON.parse(data.profile.sources);
          let cache = {};
          /**
           * ################
           * DUMMY DATA
           * Remove and replace with live data when ready
           * ################
           */
          // Change this to change from software to media
          let enableMediaEngineer = false;
          if (enableMediaEngineer) {
            platformData.user.type = "media";
          } else {
            platformData.user.type = "software";
          }

          if (!platformData.user.settings) {
            // Settings
            platformData.user.settings = {
              showMap: true,
              showInstagramFeed: true,
              instagramHideCaption: true,
              show3DDiagram: true,
              show2DDiagram: true,
              showCompanyPublic: true,
              showEmailPublic: true,
              showLocalRanking: true
            };
          }
          console.log(platformData.user.type);
          // If no type has been set, perform user data injection
          if (!platformData.user.type) {
            // Injecting platformData
            if (enableMediaEngineer) {
              // Set type to media to distinguish
              platformData.user.type = "media";
              // Set media engineer platforms
              platformData.user.platforms = {
                instagram: {
                  url: "https://www.instagram.com/aichnerchristian/"
                },
                facebook: {
                  url: "https://www.facebook.com/aichner.christian"
                },
                portfolio: {
                  url: "https://www.aichner-christia.com/portfolio"
                }
              };
              // Portfolio map
              platformData.user.mapData = [
                { name: "1", coordinates: [12.8506, 44.6086] },
                { name: "2", coordinates: [13.8496928, 46.6114363] },
                { name: "3", coordinates: [11.489387, 48.78345] }
              ];
              // Skills (like languages for programmers)
              platformData.user.skills = [
                { name: "Photography", color: "#563d7c", size: 54, share: 10 },
                { name: "Video", color: "#263d1c", size: 54, share: 20 },
                { name: "Web", color: "#763d2c", size: 54, share: 70 }
              ];
              // Instagram posts
              platformData.user.instagram = [
                { url: "https://www.instagram.com/p/B9cOSWMJbXD/" },
                { url: "https://www.instagram.com/p/B9TWGNaglUz/" }
              ];
            } else {
              // Add needed variables software engineer
              platformData.user.type = "software";
            }
            console.log(platformData);
            // Add needed variables for both software- and media engineer
            platformData.user.first_name = "Max";
            platformData.user.last_name = "Mustermann";
            console.log("PD", platformData);
          }
          /**
           * ################
           * DUMMY DATA END
           * ################
           */
          this.setState({
            fetchedUser: {
              platformData: platformData,
              sources: sources,
              username: data.profile.username,
              verified: data.profile.verified,
              accessories: {
                badges: data.profile.bids
                  ? JSON.parse(data.profile.bids)
                  : null,
                themes: data.profile.tids ? JSON.parse(data.profile.tids) : null
              }
            }
          });
          /*intel
          .fill(sources)
          .then(async () => {
            intel.calendar();
            intel.stats();
            intel.repos();
          })
          .then(async () => {
            this.setState({
              logged: true,
              contrib: intel.stats(),
              contribCalendar: intel.calendar(),
              contribTypes: intel.contribTypes(),
              user: intel.user(),
              orgs: intel.orgs(),
              languages: intel.languages(),
              repos: intel.repos(),
            });
            cache = {
              logged: true,
              contrib: intel.stats(),
              contribCalendar: intel.calendar(),
              contribTypes: intel.contribTypes(),
              user: intel.user(),
              orgs: intel.orgs(),
              languages: intel.languages(),
              repos: intel.repos(),
            };
            platformData = JSON.stringify(cache);
            this.props.caching({
              variables: { 
              token: localStorage.getItem("jwt_snek"),
              platformData
            }
            });
          });*/
        } else {
          this.setState({
            fetchedUser: false
          });
        }
        this.setState({
          fetchedUser: false
        });
      })
      .catch(err => {
        //console.error(error);
        console.error("Can not get user data.");
        this.setState({
          fetchedUser: false
        });
      });
  };

  saveSettings = state => {
    console.log("State", state);
    console.log(this.state);
    /**
     * Use caching to save new, edited data.
     * This has to be updated whenever parameters are added or removed.
     */
    // Fill platformData to be used and edited locally
    let cache = this.state.fetchedUser.platformData;
    // Check for mandatory fields
    if (state.email) {
      cache.user.first_name = state.first_name ? state.first_name : "";
      cache.user.last_name = state.last_name ? state.last_name : "";
      cache.user.email = state.email ? state.email : cache.user.email;
      cache.user.websiteUrl = state.website ? state.website : "";
      cache.user.location = state.location ? state.location : "";
      cache.user.company = state.company ? state.company : "";
      cache.user.settings = {
        showTopLanguages: state.showTopLanguages,
        showLocalRanking: state.showLocalRanking,
        show3DDiagram: state.show3DDiagram,
        show2DDiagram: state.show2DDiagram,
        showEmailPublic: state.showEmailPublic,
        showCompanyPublic: state.showCompanyPublic,
        showMap: state.showMap,
        showInstagramFeed: state.showInstagramFeed,
        instagramHideCaption: state.instagramHideCaption
      };
    }
    console.log(cache);
    let platformData = JSON.stringify(cache);
    this.session.tasks.user.cache(platformData).then(({ data }) => {
      let platformData = JSON.parse(platformData);

      /**
       * Check if pushed cache data is the same as retrieved data
       */
      if (data.cache.user.platformData === platformData) {
        this.setState({
          fetchedUser: {
            ...this.state.fetchedUser,
            platformData: JSON.parse(platformData)
          }
        });
      }
    });
  };

  fetchGitLabServers = async () => {
    this.session.tasks.general
      .gitlabServer()
      .then(({ data }) => {
        console.log(data);
        this.setState({
          gitlab_servers: data.page.supportedGitlabs
        });
      })
      .catch(error => {
        //console.error(error);
        console.error("Can not get gitlab severs.", error);
        this.setState({
          gitlab_servers: false
        });
      });
  };

  render() {
    return (
      <Router>
        <ScrollToTop>
          <div className="flyout">
            <Navbar
              username={this.state.username}
              logmeout={this.logout}
              globalState={this.state}
            />
            <ToastContainer
              hideProgressBar={false}
              newestOnTop={true}
              autoClose={3000}
            />
            <main>
              <Routes
                logmein={this.login}
                fetchProfileData={this.getData}
                globalState={this.state}
                registerUser={this.registerUser}
                saveSettings={this.saveSettings}
              />
            </main>
            <Footer />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

export default App;
