//#region > Imports
//> React
// Contains all the functionality necessary to define React components
import React from "react";
// DOM bindings for React Router
import { Link, withRouter } from "react-router-dom";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBBtn, MDBIcon } from "mdbreact";

//> Components
// To be added

//> CSS
// To be added
//#endregion

//#region > Components
class ProfilePage extends React.Component {
  state = {};

  saveSettings = (state) => {
    this.props.saveSettings(state);
  };

  componentDidMount = () => {
    console.log("MOUNT PROFILE PAGE");
    const { match, globalState, globalFunctions } = this.props;
    const username = match?.params?.username;

    if (username) {
      if (
        !globalState.loading &&
        !globalState.fetchedUser &&
        globalState.fetchedUser !== false
      ) {
        console.log("MOUNTED AND READY", globalState);
        globalFunctions.fetchCacheData(username);
      }
    }

    // Call update cache
    if (globalState.fetchedUser && globalState.loggedUser) {
      const platformData = globalState.fetchedUser.platformData;

      globalFunctions.updateCache(globalState.fetchedUser);
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const { globalState, globalFunctions } = this.props;

    console.log("UPDATED", nextProps);
  };

  render() {
    const { globalState, globalFunctions } = this.props;

    if (
      globalState.loading ||
      (!globalState.loading && !globalState.fetchedUser)
    ) {
      return (
        <div className="text-center my-5 py-5">
          <div className="spinner-grow text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    } else if (!globalState.loading && globalState.fetchedUser === false) {
      return <p>Error. User can not be fetched.</p>;
    } else if (!globalState.loading && globalState.fetchedUser) {
      console.dir(globalState.fetchedUser);
      return <p>Show profile</p>;
    } else {
      return <p>Usecase not mapped</p>;
    }
  }
}
//#endregion

//#region > Exports
export default withRouter(ProfilePage);
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
