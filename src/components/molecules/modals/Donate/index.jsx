//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBBtn,
  MDBIcon,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
} from "mdbreact";

//> Images
import { ReactComponent as LiberaPayLogo } from '../../../../assets/content/liberapay.svg';

//> CSS
import "./donate.scss";

class Donate extends React.Component {
  state = {
    visible: false
  }

  toggle = () => {
    this.setState({
      visible: !this.state.visible
    });
  }

  render() {
    return (
      <>
        <MDBModalHeader
        className="text-center text-dark donate"
        titleClass="w-100"
        tag="p"
        >
          <MDBIcon far icon="heart" className="red-text pr-2" />
          Donate
        </MDBModalHeader>
        <MDBModalBody className="text-center">
          <p>How you can support us</p>
          <MDBBtn
          color="blue"
          href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=84FMCNJ3W46FW&source=url"
          target="_blank"
          className="d-block"
          >
          <MDBIcon fab icon="paypal" className="mr-1" />
          PayPal
          </MDBBtn>
          <MDBBtn
          color="elegant"
          href="https://github.com/sponsors/Aichnerc"
          target="_blank"
          className="d-block"
          >
          <MDBIcon fab icon="github" className="mr-1" />
          GitHub Sponsors
          <MDBIcon icon="heart" className="pink-text ml-1" />
          </MDBBtn>
          <MDBBtn
          color="yellow"
          href="https://liberapay.com/aichner/donate"
          target="_blank"
          className="d-block"
          >
          <LiberaPayLogo className="liberapay mr-1" />
          <span className="d-inline">Liberapay</span>
          </MDBBtn>
          <MDBBtn
          color="orange"
          className="d-block"
          href="https://liberapay.com/aichner/donate"
          target="_blank"
          >
          <MDBIcon fab icon="btc" className="mr-1" />
          Bitcoin
          </MDBBtn>
          <div className="w-100">
            <div className="splitter my-2">
              <span className="or">
                <span className="or-text">or</span>
              </span>
            </div>
          </div>
          <MDBBtn
          className="d-block"
          color="light"
          href="mailto:contact@aichner-christian.com"
          >
          Contact us to find other ways
          </MDBBtn>
        </MDBModalBody>
        <MDBModalFooter className="text-right">
          <MDBBtn color="elegant" size="md" outline onClick={this.props.toggle}>Later</MDBBtn>
        </MDBModalFooter>
      </>
    );
  }
}

export default Donate;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
