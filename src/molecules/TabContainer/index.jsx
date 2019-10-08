//> React
// Contains all the functionality necessary to define React components
import React from 'react';

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBTabPane,
    MDBRow,
    MDBCol,
    MDBNav,
    MDBNavItem,
    MDBNavLink,
    MDBIcon,
    MDBTabContent,

} from 'mdbreact';

//> CSS
import './tabcontainer.scss';

class TabContainer extends React.Component {

    state = {
        activeItemOuterTabs: 0,
        activeItemInnerPills: 0,
    };
    
    toggleOuterTabs = tab => e => {
        if (this.state.activeItemOuterTabs2 !== tab) {
        this.setState({
            activeItemOuterTabs: tab
        });
        }
    };
    
    toggleInnerPills = tab => e => {
        if (this.state.activeItemInnerPills !== tab) {
        this.setState({
            activeItemInnerPills: tab
        });
        }
    };

    render() {
        if(this.props.vertical){
            return (
                <MDBRow id="tabcontainer">
                    <MDBCol md="3">
                        <MDBNav pills color="primary" className="flex-column">
                        {this.props.settings.map((setting, key) => {
                            return(
                                <MDBNavItem key={key}>
                                    <MDBNavLink 
                                    to="#" 
                                    active={ this.state.activeItemInnerPills === key} 
                                    onClick={this.toggleInnerPills(key)}
                                    className="text-left"
                                    >
                                    <MDBIcon icon={setting.icon} className="mr-2" /> {setting.title}
                                    </MDBNavLink>
                                </MDBNavItem>
                            )
                        })}
                        </MDBNav>
                    </MDBCol>
                    <MDBCol md="9">
                        <MDBTabContent activeItem={this.state.activeItemInnerPills}>
                        {this.props.settings.map((setting, key) => {
                            return(
                                <MDBTabPane tabId={key} key={key}>
                                    {setting.title}
                                </MDBTabPane>
                            )
                        })}
                        </MDBTabContent>
                    </MDBCol>
                </MDBRow>
            );
        } else if(this.props.horizontal){
            return (
            <>
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile"
                    aria-selected="true">Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="something-tab" data-toggle="tab" href="#something" role="tab" aria-controls="something"
                    aria-selected="false">Something</a>
                </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    Raw denim you probably haven't heard of them jean shorts Austin.
                    Nesciunt tofu stumptown aliqua, retro synth master leanse.
                    Mustache cliche tempor, williamsburg carles vegan helvetica.
                    Reprehenderit butcher retro keffiyeh dreamcatcher synth.
                    Cosby sweater eu banh mi, qui irure terry richardson ex squid.
                    Aliquip placeat salvia cillum iphone.
                    Seitan aliquip quis cardigan american apparel, butcher voluptate nisiqui.
                </div>
                <div class="tab-pane fade" id="something" role="tabpanel" aria-labelledby="something-tab">Food truck fixie
                    locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit,
                    blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee.
                    Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum
                    PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS
                    salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit,
                    sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester
                    stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</div>
                </div>
                </>
            );
        } else {
            return null
        }
        
        }
}

export default TabContainer;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
