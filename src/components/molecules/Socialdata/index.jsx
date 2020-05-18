//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { 
  MDBCardBody,
  MDBIcon,
  MDBBadge,
  MDBBtn,
} from "mdbreact";

//> Components
import { LanguageChart } from "../";

//> CSS
import "./socialdata.scss";

class Socialdata extends React.Component {
  render() {
    const {
      status,
      name,
      company,
      location,
      email,
      website,
      accounts,
      platforms,
      organisations,
    } = this.props;

    let platformsJoined = {
      github: false,
      gitlab: false,
      bitbucket: false,
    };
    if(platforms){
      platforms.map((platform, i) => {
        switch(platform.platform){
          case "GitHub":
            platformsJoined.github = true;
            return true;
          case "GitLab":
            platformsJoined.gitlab = true;
            return true;
          case "BitBucket":
            platformsJoined.bitbucket = true;
            return true;
          default:
            return false;
        }
      });
    }

    return (
      <MDBCardBody id="socialdata">
        <h4 className="font-weight-bold mb-4">{name}</h4>
        <hr/>
        <div className="text-left mb-2">
          <div>
          <MDBBadge color="secondary">Pro</MDBBadge>
          </div>
          <a href="https://www.x.com">#32</a> in your region
        </div>
        <MDBBtn
        color="grey"
        className="w-100 mx-0"
        >
        Edit profile
        </MDBBtn>
        {status && (status.message || status.icon) && (
          <>
            <hr />
            {status.icon && (
              <div dangerouslySetInnerHTML={{ __html: status.icon }}></div>
            )}
            {status.message && (
              <p className="dark-grey-text">{status.message}</p>
            )}
          </>
        )}
        {(company || location || email || website) && <hr />}
        <div className="vcard text-left">
          {company && (
            <span>
              <MDBIcon icon="building" />
              {company}
            </span>
          )}
          {location && (
            <span>
              <MDBIcon icon="map-marker-alt" />
              {location}
            </span>
          )}
          {email && (
            <a href={"mailto:" + email}>
              <span>
                <MDBIcon icon="envelope" />
                {email}
              </span>
            </a>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <MDBIcon icon="link" />
                {website}
              </span>
            </a>
          )}
          <div className="platform-list my-3 py-3">
          {platformsJoined.gitlab &&
            <MDBIcon fab icon="gitlab" size="lg" />
          }
          {platformsJoined.github &&
            <MDBIcon fab icon="github" size="lg" />
          }
          {platformsJoined.bitbucket &&
            <MDBIcon fab icon="bitbucket" size="lg" />
          }
          </div>
          <div className="organisation-list my-3 pb-3">
            {organisations.map((item, i) => {
              return(
                <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                >
                <img src={item.avatarUrl} alt={item.name+" logo"}/>
                </a>
              );
            })}
          </div>
          <LanguageChart languages={this.props.languages} />
        </div>
      </MDBCardBody>
    );
  }
}
export default Socialdata;
/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
