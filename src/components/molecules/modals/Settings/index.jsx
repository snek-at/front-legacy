//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
  MDBBtn,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBTabPane,
  MDBTabContent,
  MDBRow,
  MDBCol,
  MDBNav,
  MDBNavLink,
  MDBNavItem,
  MDBInput,
} from "mdbreact";

//> CSS
import "./settings.scss";

//> Settings data
const settingsTabs = [
  {name: "Profile", icon: ""},
  {name: "Account", icon: ""},
  {name: "Connections", icon: ""},
  {name: "Blocked users", icon: ""},
  {name: "Billing", icon: ""},
  {name: "Security", icon: ""},
]

class Settings extends React.Component {
  state = {
    changeDetected: false,
    activeItemInnerPills: 0,
    checkSum: undefined,
  }

  componentDidMount = () => {
    // Check for the current values
    if(this.props.globalState){
      if(this.props.globalState.fetchedUser){
        if(this.props.globalState.fetchedUser.platformData){
          if(this.props.globalState.fetchedUser.platformData.user){
            let data = this.props.globalState.fetchedUser.platformData.user;
            let enterData = {
              first_name: data.first_name ? data.first_name : "",
              last_name: data.last_name ? data.last_name : "",
              email: data.email ? data.email : "",
              showEmailPublic: data.showEmailPublic ? data.showEmailPublic : true,
              company: data.company ? data.company : "",
              showCompanyPublic: data.showCompanyPublic ? data.showCompanyPublic : true,
              website: data.websiteUrl ? data.websiteUrl : "",
              location: data.location ? data.location : "",
              showLocalRanking: data.showLocalRanking ? data.showLocalRanking : true,
              showTopLanguages: data.showTopLanguages ? data.showTopLanguages : true,
              show3DDiagram: data.show3DDiagram ? data.show3DDiagram : true,
              show2DDiagram: data.show2DDiagram ? data.show2DDiagram : true,
            }
            let dataString = this.stringToHash(JSON.stringify(enterData));
            this.setState({
              ...enterData,
              checksum: dataString,
            });
          } else {
            this.initBlank();
          }
        } else {
          this.initBlank();
        }
      } else {
        this.initBlank();
      }
    } else {
      this.initBlank();
    }
  }

  initBlank = () => {
    this.setState({
      first_name: "",
      last_name: "",
      email: "",
      showEmailPublic: true,
      company: "",
      showCompanyPublic: true,
      website: "",
      location: "",
      showLocalRanking: true,
      showTopLanguages: true,
      show3DDiagram: true,
      show2DDiagram: true,
    });
  }

  stringToHash = (string) => { 
    let hash = 0; 
    if (string.length == 0) return hash; 
    for (let i = 0; i < string.length; i++) { 
      let char = string.charCodeAt(i); 
      hash = ((hash << 5) - hash) + char; 
      hash = hash & hash; 
    } 
    return hash; 
  } 

  handleCheckChange = (e) => {
    this.setState({
      [e.target.name]: e.target.checked
    }, () => this.getChange());
  }

  handleTextChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    }, () => this.getChange());
  }

  getChange = () => {
    let currentData = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      showEmailPublic: this.state.showEmailPublic,
      company: this.state.company,
      showCompanyPublic: this.state.showCompanyPublic,
      website: this.state.website,
      location: this.state.location,
      showLocalRanking: this.state.showLocalRanking,
      showTopLanguages: this.state.showTopLanguages,
      show3DDiagram: this.state.show3DDiagram,
      show2DDiagram: this.state.show2DDiagram,
    }
    // Get hash of current data
    let currentHash = this.stringToHash(JSON.stringify(currentData));

    if(this.state.changeDetected){
      if(this.state.checksum === currentHash){
        this.setState({
          changeDetected: false
        });
      }
    } else {
      if(this.state.checksum !== currentHash){
        this.setState({
          changeDetected: true
        });
      }
    }
  }

  toggleInnerPills = tab => e => {
    if (this.state.activeItemInnerPills !== tab) {
      this.setState({
        activeItemInnerPills: tab
      });
    }
  };

  save = () => {
    this.props.saveSettings(this.state)
  }

  render() {
    return (
      <MDBModal 
      modalStyle="white"
      className="text-dark"
      size="lg"
      id="settings"
      backdrop={true}
      isOpen={true}
      toggle={this.props.closeModal}
      >
        <MDBModalHeader
        className="text-center text-dark donate"
        titleClass="w-100"
        tag="p"
        >
          <MDBIcon icon="wrench" className="green-text pr-2" />
          Settings
        </MDBModalHeader>
        <MDBModalBody className="text-center">
          <MDBRow>
            <MDBCol md="4">
              <MDBNav pills color="primary" className="flex-column">
              {settingsTabs.map((tab, i) => {
                return(
                  <MDBNavItem>
                    <MDBNavLink link to="#" active={ this.state.activeItemInnerPills === i} onClick={this.toggleInnerPills(i)} >
                      {tab.name}
                    </MDBNavLink>
                  </MDBNavItem>
                )
              })}
              </MDBNav>
            </MDBCol>
            <MDBCol md="8">
              <MDBTabContent activeItem={this.state.activeItemInnerPills}>
                <MDBTabPane tabId={0}>
                  <h5>Profile</h5>
                  <div className="personal-data">
                    <p className="font-weight-bold">Your full name</p>
                    <MDBRow>
                      <MDBCol md="6">
                        <input 
                        type="text"
                        name="first_name"
                        className="form-control"
                        onChange={this.handleTextChange}
                        value={this.state.first_name}
                        placeholder="Firstname"
                        />
                      </MDBCol>
                      <MDBCol md="6">
                        <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        onChange={this.handleTextChange}
                        value={this.state.last_name}
                        placeholder="Lastname"
                        />
                      </MDBCol>
                    </MDBRow>
                    <p className="font-weight-bold">Public email</p>
                    <MDBRow>
                      <MDBCol md="12">
                        <input 
                        type="email"
                        name="email"
                        className="form-control"
                        onChange={this.handleTextChange}
                        value={this.state.email}
                        placeholder="Email"
                        />
                      </MDBCol>
                    </MDBRow>
                    <MDBInput
                      label={<p>Display email on profile</p>}
                      filled
                      type='checkbox'
                      id='checkbox0'
                      name="showEmailPublic"
                      onChange={this.handleCheckChange}
                      checked={this.state.showEmailPublic}
                      containerClass='mr-5'
                    />
                    <p className="font-weight-bold">Your workplace</p>
                    <MDBRow>
                      <MDBCol md="12">
                        <input 
                        type="text"
                        name="company"
                        className="form-control"
                        onChange={this.handleTextChange}
                        value={this.state.company}
                        placeholder="Company"
                        />
                      </MDBCol>
                    </MDBRow>
                    <small className="d-block">You can @mention your company anywhere on SNEK</small>
                    <MDBInput
                      label={<p>Display company on profile</p>}
                      filled
                      type='checkbox'
                      id='checkbox1'
                      name="showCompanyPublic"
                      onChange={this.handleCheckChange}
                      checked={this.state.showCompanyPublic}
                      containerClass='mr-5'
                    />
                    <p className="font-weight-bold">Website</p>
                    <MDBRow>
                      <MDBCol md="12">
                        <input 
                        type="text"
                        name="website"
                        className="form-control"
                        onChange={this.handleTextChange}
                        value={this.state.website}
                        placeholder="Website URL"
                        />
                      </MDBCol>
                    </MDBRow>
                    <p className="font-weight-bold">Location</p>
                    <MDBRow>
                      <MDBCol md="12">
                        <input 
                        type="text"
                        name="location"
                        className="form-control"
                        onChange={this.handleTextChange}
                        value={this.state.location}
                        placeholder="City, Country"
                        />
                      </MDBCol>
                    </MDBRow>
                    <small className="d-block">This can also assist us in finding you the best local matches</small>
                  </div>
                  <hr />
                  <MDBRow>
                    <MDBCol md="12">
                      <MDBInput
                        label={<p>Show local ranking</p>}
                        filled
                        type='checkbox'
                        id='checkbox3'
                        name="showLocalRanking"
                        onChange={this.handleCheckChange}
                        checked={this.state.showLocalRanking}
                        containerClass='mr-5'
                      />
                    </MDBCol>
                    <MDBCol md="12">
                      <MDBInput
                        label={<p>Show top programming languages</p>}
                        filled
                        type='checkbox'
                        id='checkbox4'
                        name="showTopLanguages"
                        onChange={this.handleCheckChange}
                        checked={this.state.showTopLanguages}
                        containerClass='mr-5'
                      />
                    </MDBCol>
                    <MDBCol md="12">
                      <hr />
                    </MDBCol>
                    <MDBCol md="12">
                      <MDBInput
                        label={<p>Show 3D work activity diagram</p>}
                        filled
                        type='checkbox'
                        id='checkbox5'
                        name="show3DDiagram"
                        onChange={this.handleCheckChange}
                        checked={this.state.show3DDiagram}
                        containerClass='mr-5'
                      />
                    </MDBCol>
                    <MDBCol md="12">
                      <MDBInput
                        label={<p>Show 2D work activity diagram</p>}
                        filled
                        type='checkbox'
                        id='checkbox6'
                        name="show2DDiagram"
                        onChange={this.handleCheckChange}
                        checked={this.state.show2DDiagram}
                        containerClass='mr-5'
                      />
                    </MDBCol>
                  </MDBRow>
                </MDBTabPane>
                <MDBTabPane tabId={1}>
                  <h5>Panel 2</h5>
                </MDBTabPane>
                <MDBTabPane tabId={2}>
                  <h5>Panel 3</h5>
                </MDBTabPane>
              </MDBTabContent>
            </MDBCol>
          </MDBRow>
        </MDBModalBody>
        <MDBModalFooter className="text-right">
          {this.state.changeDetected &&
          <MDBBtn color="green" onClick={this.save}>Save</MDBBtn>
          }
          <MDBBtn color="elegant" outline onClick={this.props.closeModal}>Close</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }
}

export default Settings;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
