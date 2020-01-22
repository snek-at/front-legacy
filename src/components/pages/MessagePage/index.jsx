//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBContainer,
  MDBBtn,
  MDBAlert,
  MDBIcon,
  MDBModal,
} from "mdbreact";

//> Components
import {
  Donate,
} from "../../molecules/modals";

//> CSS
import "./messagepage.scss";

//> Images
import snakeAnimation from "../../../assets/content/snake.gif";

class MessagePage extends React.Component {
  state = {
    modalDonate: false,
  }

  toggleModalDonate = () => {
    this.setState({
      modalDonate: !this.state.modalDonate
    });
  }

  render() {
    return (
      <MDBContainer id="message" className="py-5 my-5 text-center">
        {this.props.location.pathname === "/donate/cancel" &&
        <>
          <h2>
          Thank you for considering to donate
          <MDBIcon icon="heart" className="pink-text ml-2"/>
          </h2>
          <p className="lead mt-3 mb-0">
          We are a <strong>non-profit</strong>, <strong>open source</strong> Social Network.
          </p>
          <p>
          We therefore require donations to stay up-and-running.
          </p>
          <p className="mb-0">If you change your mind later, you can always</p>
          <MDBBtn
          color="green"
          size="md"
          onClick={() => this.setState({modalDonate: true})}
          >
          Donate
          </MDBBtn>
          {this.state.modalDonate &&
          <MDBModal 
          modalStyle="white"
          className="text-dark"
          size="sm"
          backdrop={true}
          isOpen={this.state.modalDonate}
          toggle={this.toggleModalDonate}
          >
            <Donate toggle={this.toggleModalDonate} />
          </MDBModal>
          }
        </>
        }
        {this.props.location.pathname === "/donate/thankyou" &&
        <>
          <img 
          src={snakeAnimation}
          alt="Animated snake slithering"
          className="img-fluid img-snake"
          />
          <h2>
          Thank you for your donation!
          <MDBIcon icon="heart" className="pink-text ml-2"/>
          </h2>
          <p className="lead mt-3 mb-0">
          We are a <strong>non-profit</strong>, <strong>open source</strong> Social Network.
          </p>
          <p>
          We therefore require donations to stay up-and-running.
          </p>
          <p className="mb-0">
          Your donation, therefore, means a lot to us!
          <MDBIcon icon="heart" className="pink-text ml-1"/>
          </p>
          <MDBBtn
          color="green"
          size="md"
          >
          Login
          <MDBIcon icon="angle-right" className="pl-1" />
          </MDBBtn>
          <MDBBtn
          color="green"
          size="md"
          >
          My profile
          <MDBIcon icon="angle-right" className="pl-1" />
          </MDBBtn>
        </>
        }
      </MDBContainer>
    );
  }
}

export default MessagePage;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
