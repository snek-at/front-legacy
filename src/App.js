//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { BrowserRouter as Router } from "react-router-dom";

//> TEMP TEMP TEMP TEMP TEMP TEMP DELETE THIS SHIT MAN
import sha256 from "js-sha256";

//> Components
// Navbar and Footer
import { Navbar, Footer } from "./components/molecules";
// Starts the page on top when reloaded or redirected
import { ScrollToTop } from "./components/atoms";

//> Routes
//import Routes from "./Routes";

//> Intel
import { Intel } from "snek-intel";

class App extends React.Component {
  state = {
    loggedUser: undefined,
    fetchedUser: undefined,
  };

  componentDidMount = () => {
    // Create new intel instance
    this.intel = new Intel();
    // Create new session link for easy access
    this.session = this.intel.snekclient.session;
    // Begin session
    this.begin();

    // TEMP
    this.login("Aichnerc", sha256("test123"));
  };

  //> Authentication methods
  /**
   * Begin Session
   * @description Start a new session based on authentication history.
   *              New site access will lead to a anonymous login.
   */
  begin = async () => {
    const whoami = await this.session.begin();

    // Check if whoami is not empty
    if (whoami?.whoami?.username) {
      const username = whoami.whoami.username;

      // Check if whoami user is not anonymous user
      if (username !== process.env.REACT_APP_ANONYMOUS_USER) {
        // Get loggedUser object
        const loggedUser = {
          username,
          avatarUrl:
            "https://avatars2.githubusercontent.com/u/21159914?u=afab4659183999f1adc85089bb713aefbf085b94",
        };

        // Real user is logged in
        this.handleLogin(loggedUser);
      }
    }
  };

  /**
   * Authenticate
   * @description Logs in user
   */
  login = async (username, password) => {
    console.log(username, password);
    return this.session
      .begin({
        username,
        password,
      })
      .then((res) => {
        return {
          username: res.username,
          avatarUrl:
            "https://avatars2.githubusercontent.com/u/21159914?u=afab4659183999f1adc85089bb713aefbf085b94",
        };
      })
      .catch((err) => {
        console.error("LOGIN", err);
        return false;
      });
  };

  /**
   * Handle login
   * @description Handles states for login
   */
  handleLogin = (loggedUser) => {
    if (loggedUser) {
      this.setState({
        loggedUser,
      });
    }
  };

  /**
   * Logout user
   * @description Handles the logging out of active users
   */
  logout = () => {
    this.setState(
      {
        loggedUser: undefined,
        fetchedUser: undefined,
      },
      () => this.session.end().then(() => this.begin())
    );
  };

  /**
   * Register user
   * @description Handles the registration of users
   */
  registerUser = async (registrationData) => {
    // Get data from source
    let intelData;

    this.appendSourceObjects(registrationData.sources)
      .then(async () => {
        intelData = await this.getData();
        this.intel
          .generateTalks(registrationData.sources)
          .then(async () => {
            intelData.talks = await this.getAllTalks();

            // Save Object to platformData as JSON
            registrationData.platform_data = JSON.stringify(intelData);
            // Create JSON string out of sources for backend use
            registrationData.sources = JSON.stringify(registrationData.sources);

            // Register the user in our SNEK engine
            this.session.tasks.user
              .registration(registrationData)
              .then((res) => {
                if (res.message === "FAIL") {
                  console.log("warn", "All fields have to be filled!");
                } else {
                  // Set cache
                  this.session.tasks.user.cache(registrationData.platform_data);
                  // Login user
                  this.login(
                    registrationData.username,
                    registrationData.password
                  );
                }
              })
              .catch((err) => {
                console.error("REGISTRATION IN ENGINE", err);
              });
          })
          .catch((err) => {
            console.error("GENERATE TALKS", err);
          });
      })
      .catch((err) => {
        console.error("APPEND SOURCE OBJECTS", err);
      });
  };

  /**
   * Append Source Objects
   * @description Hands source list over to intel
   */
  appendSourceObjects = async (sourceList) => {
    return this.intel.appendList(sourceList);
  };

  /**
   * Get intel data
   * @description Retrieves data from current applied source list
   */
  getData = async () => {
    const data = await this.intel.get();

    console.log("GET DATA", data);

    return data;
  };

  /**
   * Fetch GitLab Servers
   * @description Retrieves a list of available GitLab servers
   */
  fetchGitLabServers = () => {
    return this.session.tasks.general
      .gitlabServer()
      .then(({ data }) => {
        return data.page.supportedGitlabs;
      })
      .catch((err) => {
        console.error("GET GITLAB SERVERS", err);
        return false;
      });
  };

  /**
   * Get all users
   * @description Retrieves a list of all users
   */
  getAllPageUrls = () => {
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

  /**
   * Get all talks
   * @description Retrieves a list of all currently available talks
   */
  getAllTalks = async () => {
    return this.intel.getTalks();
  };

  /**
   * Upload talk
   * @description Uploads a talk to intel
   */
  uploadTalk = async (file) => {
    await this.intel.appendTalk(file);

    let talks = await this.getAllTalks();

    talks[talks.length - 1].repository = {
      avatarUrl: this.state.fetchedUser.platformData.profile.avatarUrl,
      owner: {
        username: this.state.user,
      },
    };

    this.state.fetchedUser.platformData.talks.push(talks[talks.length - 1]);
    this.session.tasks.user.cache(
      JSON.stringify(this.state.fetchedUser.platformData)
    );
  };

  /**
   * Delete talk
   * @description Deletes a talk
   */
  deleteTalk = async (talk) => {
    let talks = this.state.fetchedUser.platformData.talks;

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

    this.session.tasks.user.cache(
      JSON.stringify(this.state.fetchedUser.platformData)
    );
  };

  /**
   * Get talk
   * @description Get a talk
   */
  getTalk = async (uid, username) => {
    return this.session.tasks.user
      .profile("/registration/" + username)
      .then(async ({ data }) => {
        console.log(data, "xxxxx");
        if (data.profile) {
          let talks = JSON.parse(data.profile.platformData).talks;
          talks = talks.filter((talk) => {
            return talk.uid === uid;
          });

          return talks[0];
        } else {
          console.error("GET TALK", "Can not get talk " + uid);
        }
      })
      .catch((err) => {
        console.error("GET TALK", err);
      });
  };

  /**
   * Save settings
   * @description Saves the user settings
   */
  saveSettings = (state) => {
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
        activeTheme: state.activeTheme,
      };
    }
    const platformData = JSON.stringify(cache);

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

  /**
   * Fetch Cache Data
   * @description Retrieves current cache data and updates it
   */
  fetchCacheData = async (username) => {
    this.session.tasks.user
      .profile("/registration/" + username)
      .then(async ({ data }) => {
        console.log("CACHE DATA", data);
        // Check if cache is empty
        if (!data.profile) {
          this.setState(
            {
              fetchedUser: false,
            },
            () => console.error("CACHE NOT LOADED")
          );
        } else {
          // Split profile to chunks
          const profile = data.profile;
          let platformData = profile.platformData
            ? JSON.parse(profile.platformData)
            : {};
          let user = platformData.user ? platformData.user : null;
          const sources = profile.sources ? JSON.parse(profile.sources) : null;

          // Check if data is valid
          if (!user || !sources) {
            console.error("USER OR SOURCES IS EMPTY", user, sources);
          } else {
            // Set settings for first time fetching
            if (!user.settings) {
              user.settings = {
                show3DDiagram: true,
                show2DDiagram: true,
                showCompanyPublic: true,
                showEmailPublic: true,
                showLocalRanking: true,
                activeTheme: null,
              };
            }

            // Build fetchedUser object
            let fetchedUser = {
              platformData: {
                ...platformData,
                user,
              },
              sources,
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

            console.log(fetchedUser);

            // Update visible data
            this.setState(
              {
                fetchedUser,
              },
              async () => {
                if (this.state.loggedUser.username === user.username) {
                  this.appendSourceObjects(sources)
                    .then(async () => {
                      await this.intel.generateTalks(sources);

                      let talks = await this.getAllTalks();

                      // Fix duplicates
                      for (const i in talks) {
                        let state = true;

                        for (const i2 in platformData.talks) {
                          if (talks[i].url === platformData.talks[i2].url) {
                            state = false;
                          }
                        }
                        if (state) {
                          platformData.talks.push(talks[i]);
                        }
                      }

                      talks = platformData.talks;

                      //await this.getData().then((res) => console.log(res));
                      platformData = { ...(await this.getData()), user, talks };

                      console.log("PLATTFORM DATA AFTER FETCH", platformData);

                      // Override cache
                      this.session.tasks.user
                        .cache(JSON.stringify(platformData))
                        .then(() => {
                          fetchedUser.platformData = platformData;
                          this.setState({
                            fetchedUser,
                          });
                        });
                    })
                    .then(() => {
                      console.log("RESET REDUCER");
                      this.intel.resetReducer();
                    });
                }
              }
            );
          }
        }
      });
  };

  render() {
    console.log("STATE", this.state);
    if (this.state.loggedUser) {
      if (!this.state.fetchedUser) {
        this.fetchCacheData(this.state.loggedUser.username).then(() =>
          console.log("CACHE FINISHED")
        );
      }
    }
    return (
      <Router>
        <ScrollToTop>
          <div className="flyout">
            {/**<Navbar />*/}
            <main>
              <h2>Routes</h2>
            </main>
            <Footer />
          </div>
        </ScrollToTop>
      </Router>
    );
  }
}

export default App;
