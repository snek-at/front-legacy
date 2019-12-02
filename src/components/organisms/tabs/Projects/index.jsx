//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { 
  MDBTabPane,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdbreact";

//> CSS
import "./projects.scss";

class Projects extends React.Component {

  state = {};

  getBadge = async (name, url) => {
    if(!this.state[name]){
      let response = await fetch(url);
      if (response.ok) {
        let badge = await response.text();
        if(!badge.includes("repo not found")){
          this.setState({
            [name]: url
          });
        } else {
          this.setState({
            [name]: null
          });
        }
      }
    }
  }

  render() {
    console.log(this.state);
    return (
      <MDBTabPane tabId={this.props.id} role="tabpanel">
        {this.props.repos && (
          <>
            <h3 className="font-weight-bold mt-4">Repositories</h3>
            <MDBRow className="project-list">
              {this.props.repos.map((repo, key) => {

                if(this.state["lastCommit"+key] === undefined){
                  this.getBadge("lastCommit"+key,"https://cors-anywhere.herokuapp.com/https://img.shields.io/github/last-commit/"+repo.owner.login+"/"+repo.name);
                }

                return (
                  <MDBCol key={key} md="6">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <li>
                    <div>
                      <p className="lead mb-1 float-left">
                      {repo.name}
                      </p>
                      {repo.languagePie.slices.length > 0 ? (
                        <small className="mb-1 float-right text-muted">
                        <MDBIcon icon="square" className="pr-1" style={{color: repo.languagePie.slices[0].color}} />
                        {repo.languagePie.slices[0].name}
                        </small>
                      ) : (
                        <small className="mb-1 float-right text-muted">
                        No top language
                        </small>
                      )}
                    </div>
                    <div className="clearfix" />
                    <div>
                      <img src={repo.avatarUrl} alt={repo.owner.login}/>
                      <small>Owned by {repo.owner.login}</small>
                    </div>
                    <div className="py-2">
                      <img 
                      className="img-badge"
                      src={this.state["lastCommit"+key]}
                      />
                    </div>
                    </li>
                  </a>
                  </MDBCol>
                );
              })}
            </MDBRow>
          </>
        )}
      </MDBTabPane>
    );
  }
}

export default Projects;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
