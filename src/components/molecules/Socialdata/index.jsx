//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import { MDBCardBody, MDBIcon } from "mdbreact";

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
      accounts
    } = this.props;

    console.log(status);

    return (
      <MDBCardBody id="socialdata">
        <h4 className="font-weight-bold mb-4">{name}</h4>
        {(status.message || status.emojiHTML) && (
          <>
            <hr />
            {status.emojiHTML && (
              <div dangerouslySetInnerHTML={{ __html: status.emojiHTML }}></div>
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
              href={"https://" + website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <MDBIcon icon="link" />
                {website}
              </span>
            </a>
          )}
          <LanguageChart />
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
