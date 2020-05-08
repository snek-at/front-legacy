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
import { longStackSupport } from "q";

class App extends React.Component {
  state = {
    logged: false,
    selectedUser: undefined,
    user: undefined,
    fetchedUser: undefined,
    activeTab: 0,
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
    const whoami = await this.session.begin();
    if (whoami && whoami.whoami && whoami.whoami.username) {
      if (whoami.whoami.username !== "cisco") {
        this.setState({
          loading: false,
          logged: true,
          user: whoami.whoami.username,
        });
      }
    }
  }

  /**
   * Props functions
   * #DA: See Documentation "Data Management States"
   */

  /**
   * Authentication / Registration Tasks
   */
  login = async (username, password) => {
    console.log("Call login");
    this.session
      .begin({
        username,
        password,
      })
      .then((res) => {
        console.log("Login successful for user " + username, res.username);
        console.log(res);
        this.setState({
          loading: false,
          logged: true,
          user: res.username,
        });
      })
      .catch((err) => {
        console.log("Login failed for user " + username);
        console.error(err);
        this.setState({
          loading: false,
          logged: false,
          user: null,
        });
      });

    console.log("Check for user login", this.session.tasks.user.whoami());
  };

  anonymousLogin = async () => {
    console.log("Anonymous login called");
    await this.session.begin();
  };

  logout = () => {
    console.log("Logout called");
    this.setState(
      {
        loading: false,
        logged: false,
        fetchedUser: undefined,
        user: undefined,
        activeTab: 0,
        selectedUser: undefined,
      },
      () => {
        this.session.end().then(() => this.anonymousLogin());
      }
    );
  };

  //> Register
  registerUser = async (registrationData) => {
    // Get data from source
    await this.appendSourceObjects(registrationData.sources);
    const devData = await this.getData();
    let organizations = devData.profile.organizations.map((org) => {
      return org.name;
    })
    await this.intel.generateTalks(registrationData.sources, organizations);
    devData.talks = await this.getAllTalks();
    registrationData.platform_data = JSON.stringify(devData);
    // Create JSON string out of sources for backend use
    registrationData.sources = JSON.stringify(registrationData.sources);
    console.log(registrationData, "REG");
    // Register the user in our engine
    this.registerInEngine(registrationData);
  };

  registerInEngine = (registrationData) => {
    this.session.tasks.user.registration(registrationData).then((res) => {
      console.log(res);
      if (res.message === "FAIL") {
        console.log("warn", "All fields have to be filled!");
      } else {
        // Set cache
        this.session.tasks.user.cache(registrationData.platform_data);
        // Login user
        this.login(registrationData.username, registrationData.password);
      }
    });
  };

  appendSourceObjects = async (sourceList) => {
    return this.intel.appendList(sourceList);
  };

  // Get user data from intel
  getData = async () => {
    //console.log(this.intel.get());
    let data = await this.intel.get()
    return data;
  };

  /**
   * Data Tasks
   */
  fetchCacheData = async (username) => {
    console.log("Get Data called");
    this.session.tasks.user
      .profile("/registration/" + username)
      .then(async ({ data }) => {
        console.log("Got data for " + username);
        console.log("DATA ", data);
        if (!data.profile) {
          console.log("Can not get profile");
          this.setState({
            fetchedUser: null,
          });
        } else {
          if (data.profile.verified) {
            // Redirect and login
            let profile = data.profile;
            let platformData = profile.platformData
              ? JSON.parse(profile.platformData)
              : null;
            let user = platformData.user ? platformData.user : null;
            let sources = profile.sources ? JSON.parse(profile.sources) : null;
            
            // Reconstruct intel
            /*this.intel.reducer.reload();
            await this.appendSourceObjects(sources);
            let devData = this.getData();
            platformData.devData = devData;*/

            /**
             * ################
             * DUMMY DATA
             * Remove and replace with live data when ready
             * ################
             */
            if (!user) {
              user = {
                type: undefined,
              };
            }
            user.firstName = data.profile.firstName
              ? data.profile.firstName
              : "";
            user.lastName = data.profile.lastName ? data.profile.lastName : "";
            user.email = data.profile.email ? data.profile.email : "";
            user.username = data.profile.username ? data.profile.username : "";
            // Change this to change from software to media
            let enableMediaEngineer = false;
            if (enableMediaEngineer) {
              user.type = "media";
            } else {
              user.type = "software";
            }
            console.log("Got platform data", platformData);

            if (!user.settings) {
              // Settings
              user.settings = {
                showMap: true,
                showInstagramFeed: true,
                show3DDiagram: true,
                instagramHideCaption: true,
                show2DDiagram: true,
                showCompanyPublic: true,
                showEmailPublic: true,
                showLocalRanking: true,
                activeTheme: null,
              };
            }
            console.log(user.type);
            // If no type has been set, perform user data injection
            if (!user.type) {
              // Injecting platformData
              if (enableMediaEngineer) {
                // Set type to media to distinguish
                user.type = "media";
                // Define perks if not set
                user.perks = user.perks ? user.perks : {};
                // Set media engineer platforms
                user.perks.platforms = {
                  instagram: {
                    url: "https://www.instagram.com/aichnerchristian/",
                  },
                  facebook: {
                    url: "https://www.facebook.com/aichner.christian",
                  },
                  portfolio: {
                    url: "https://www.aichner-christia.com/portfolio",
                  },
                };
                // Portfolio map
                user.perks.mapData = [
                  { name: "1", coordinates: [12.8506, 44.6086] },
                  { name: "2", coordinates: [13.8496928, 46.6114363] },
                  { name: "3", coordinates: [11.489387, 48.78345] },
                ];
                // Skills (like languages for programmers)
                user.perks.skills = [
                  {
                    name: "Photography",
                    color: "#563d7c",
                    size: 54,
                    share: 10,
                  },
                  { name: "Video", color: "#263d1c", size: 54, share: 20 },
                  { name: "Web", color: "#763d2c", size: 54, share: 70 },
                ];
                // Instagram posts
                user.perks.instagram = [
                  { url: "https://www.instagram.com/p/B9cOSWMJbXD/" },
                  { url: "https://www.instagram.com/p/B9TWGNaglUz/" },
                ];
              } else {
                // Add needed variables software engineer
                user.type = "software";
              }
              // Add needed variables for both software- and media engineer
              user.first_name = "Max";
              user.last_name = "Mustermann";

              console.log("Injected data to platform data", platformData);
            }
            /**
             * ################
             * DUMMY DATA END
             * ################
             */
            let fetchedUser = {
              platformData: {
                ...platformData,
                user,
              },
              sources,
              selectedUser: data.profile.username,
              verified: data.profile.verified,
              accessories: {
                badges: data.profile.bids
                  ? JSON.parse(data.profile.bids)
                  : null,
                themes: data.profile.tids
                  ? JSON.parse(data.profile.tids)
                  : null,
              },
            };

            this.setState(
              {
                fetchedUser,
              },
              async () => {
                // Update cache
                this.intel.resetReducer();
                this.intel.appendList(sources).then(async () => {
                  //platformData.talks = [];
                  let organizations = platformData.profile.organizations.map((org) => {
                    return org.name;
                  })
                  await this.intel.generateTalks(sources, organizations);
                  let talks = await this.getAllTalks();
                  for (const i in talks) {
                    let state = true;
                    for (const i2 in platformData.talks) {
                      if (talks[i].url === platformData.talks[i2].url) {
                        state = false;
                      }
                    }
                    if (state) {
                      platformData.talks.push(talks[i])
                    }
                  }
                  talks = platformData.talks;
                  platformData = { ...await this.getData(), user, talks };
                  this.session.tasks.user
                    .cache(JSON.stringify(platformData))
                    .then(() => {
                      fetchedUser.platformData = platformData;
                      this.setState({
                        fetchedUser,
                      });
                    });
                });
              }
            );
          } else {
            console.error("User not verified.");
            this.setState({
              fetchedUser: false,
            });
          }
        }
      })
      .catch((err) => {
        console.error("Can not get user data.", err);
        this.setState({
          fetchedUser: null,
        });
      });
  };

  saveSettings = (state) => {
    /**
     * Use caching to save new, edited data.
     * This has to be updated whenever parameters are added or removed.
     */
    // Fill platformData to be used and edited locally
    let cache = this.state.fetchedUser.platformData;
    // Check for mandatory fields
    if (state.email) {
      cache.user.firstName = state.first_name ? state.first_name : "";
      cache.user.lastName = state.last_name ? state.last_name : "";
      cache.user.email = state.email ? state.email : cache.user.email;
      cache.profile.websiteUrl = state.website ? state.website : "";
      cache.profile.location = state.location ? state.location : "";
      cache.profile.company = state.company ? state.company : "";
      cache.user.settings = {
        showTopLanguages: state.showTopLanguages,
        showLocalRanking: state.showLocalRanking,
        show3DDiagram: state.show3DDiagram,
        show2DDiagram: state.show2DDiagram,
        showEmailPublic: state.showEmailPublic,
        showCompanyPublic: state.showCompanyPublic,
        showMap: state.showMap,
        showInstagramFeed: state.showInstagramFeed,
        instagramHideCaption: state.instagramHideCaption,
        activeTheme: state.activeTheme,
      };
    }
    console.log("Cache", cache);
    let platformData = JSON.stringify(cache);
    this.session.tasks.user.cache(platformData).then(({ data }) => {
      console.log(data);
      this.setState({
        fetchedUser: {
          ...this.state.fetchedUser,
          platformData: JSON.parse(platformData),
        },
      });
    });
  };

  fetchGitLabServers = () => {
    console.log("Fetching GitLab servers");
    return this.session.tasks.general
      .gitlabServer()
      .then(({ data }) => {
        return data.page.supportedGitlabs;
      })
      .catch((err) => {
        //console.error(error);
        console.error("Can not get GitLab severs.", err);
        return false;
      });
  };

  getAllPageUrls = () => {
    console.log("Get all page urls called");
    return this.session.tasks.general.allPageUrls().then((res) => {
      let urls = [];

      res.data.pages &&
        res.data.pages.forEach((page) => {
          if (page.urlPath.includes("registration/")) {
            let url = page.urlPath.split("/")[2];
            urls.push(url);
          }
        });

      return urls;
    });
  };

  getAllTalks = async () => {
    return this.intel.getTalks();
  }

  uploadTalk = async (file) => {
    await this.intel.appendTalk(file);
    let talks = await this.getAllTalks();
    
    talks[talks.length - 1].repository = {
      avatarUrl: this.state.fetchedUser.platformData.profile.avatarUrl,
      owner: {
        username: this.state.user,
      },
    }
    
    this.state.fetchedUser.platformData.talks.push(talks[talks.length - 1]);
    this.session.tasks.user
    .cache(JSON.stringify(this.state.fetchedUser.platformData));
  }

  deleteTalk = async (talk) => {
    let talks = this.state.fetchedUser.platformData.talks
    for (const index in talks) {
      if (talk.uid === talks[index].uid) {
        talks.splice(index, 1);
      }
    }

    this.setState({
      fetchedUser: {
        ...this.state.fetchedUser,
        platformData: {
          ...this.state.fetchedUser.platformData,
          talks,
        },
      },
    });

    this.session.tasks.user
    .cache(JSON.stringify(this.state.fetchedUser.platformData));
  }

  getTalk = async (uid, username) => {
    return this.session.tasks.user
      .profile("/registration/" + username)
      .then(async ({ data }) => {
        console.log(data, "xxxxx");
        if (!data.profile) {
          this.setState({
            fetchedUser: null,
          });
        } else {
          let talks = JSON.parse(data.profile.platformData).talks;
          talks = talks.filter((talk) => {
            return talk.uid === uid;
          })

          return talks[0];
        }
      })
  }

  render() {
    console.log("Refreshing component");
    console.log("App.js", this.state);
    console.log("App.js props", this.props);

    return (
      <Router>
        <ScrollToTop>
          <div className="flyout">
            <Navbar
              username={this.state.user}
              logmeout={this.logout}
              users={this.getAllPageUrls}
              globalState={this.state}
            />
            <ToastContainer
              hideProgressBar={false}
              newestOnTop={true}
              autoClose={3000}
            />
            <main
              className={
                this.state.fetchedUser &&
                this.state.fetchedUser.platformData.user &&
                this.state.fetchedUser.platformData.user.settings &&
                this.state.fetchedUser.platformData.user.settings.activeTheme
                  ? "theme-" +
                    this.state.fetchedUser.platformData.user.settings
                      .activeTheme
                  : undefined
              }
            >
              <Routes
                logmein={this.login}
                fetchCacheData={this.fetchCacheData}
                globalState={this.state}
                registerUser={{
                  register: this.registerUser,
                  getGitLabServers: this.fetchGitLabServers,
                }}
                saveSettings={this.saveSettings}
                uploadTalk={this.uploadTalk}
                getTalk={this.getTalk}
                deleteTalk={this.deleteTalk}
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

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
