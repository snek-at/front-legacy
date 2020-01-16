//> React
// Contains all the functionality necessary to define React components
import React from "react";
// Links (replaces <a> tags)
import { Link } from "react-router-dom";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import {
    MDBFooter,
    MDBRow,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBBtn,
    MDBSwitch,
    MDBBadge,
} from "mdbreact";

//> CSS
import "./footer.scss";

//> Images
// Logo
import Logo from  "../../../assets/navigation/logo.png";

//> Dynamic texts
// Slogans
const slogans = [
    "Werde eine SNEK!",
    "Verbinde dich mit deinen KollegInnen!",
    "Zeige der Welt was du kannst!",
    "Worauf warten Sie noch?",
]

class Footer extends React.PureComponent{
    state = {
        slogan: "",
    }

    // When component is ready to mount
    componentWillMount(){
        this._getSlogan();
    }

    // Get a random slogan and save to state
    _getSlogan = () => {
        this.setState({slogan: slogans[Math.floor(Math.random()*slogans.length)]});
    }

    render(){
        return(
            <MDBFooter color="white text-dark">
                <MDBRow className="social">
                    <MDBCol md="12" className="text-center">
                        <h4>Verbinden Sie sich mit uns!</h4>
                    </MDBCol>
                    <MDBCol md="12" className="text-center">
                        <MDBBtn
                        tag="a"
                        floating
                        social="git"
                        href="https://github.com/aichner"
                        rel="noopener noreferrer"
                        target="_blank"
                        >
                            <MDBIcon fab icon="github fa-lg" />
                        </MDBBtn>
                        <MDBBtn
                        tag="a"
                        floating
                        social="ins"
                        href="https://www.instagram.com/aichnerchristian/"
                        rel="noopener noreferrer"
                        target="_blank"
                        >
                            <MDBIcon fab icon="instagram" />
                        </MDBBtn>
                        <MDBBtn
                        tag="a"
                        floating
                        social="fb"
                        href="https://www.facebook.com/werbeagentur.aichner"
                        rel="noopener noreferrer"
                        target="_blank"
                        >
                            <MDBIcon fab icon="facebook-f fa-lg" />
                        </MDBBtn>
                        <MDBBtn
                        tag="a"
                        floating
                        social="li"
                        href="https://linkedin.com/in/aichnerc"
                        rel="noopener noreferrer"
                        target="_blank"
                        >
                            <MDBIcon fab icon="linkedin-in" />
                        </MDBBtn>
                        <MDBBtn
                        tag="a"
                        floating
                        social="tw"
                        href="https://twitter.com/realaichner"
                        rel="noopener noreferrer"
                        target="_blank"
                        >
                            <MDBIcon fab icon="twitter" />
                        </MDBBtn>
                        <MDBBtn
                        tag="a"
                        floating
                        social="wa"
                        href="https://api.whatsapp.com/send?phone=4368120502754&text=Hey%2C%20ich%20bin%20interessiert%20an%20einem%20Angebot%20eurer%20Agentur."
                        rel="noopener noreferrer"
                        target="_blank"
                        >
                            <MDBIcon fab icon="whatsapp" />
                        </MDBBtn>
                        <MDBBtn
                        tag="a"
                        floating
                        social="email"
                        href="mailto:info@aichner-christian.com"
                        >
                            <MDBIcon far icon="envelope" />
                        </MDBBtn>
                    </MDBCol>
                </MDBRow>
                <MDBContainer className="text-center text-md-left pt-5">
                    <MDBRow>
                        <MDBCol md="2">
                            <img src={Logo} alt="SNEK Logo" className="img-fluid" />
                            <p className="mt-2">
                            Social Network,<br/>built for engineers.
                            </p>
                        </MDBCol>
                        <MDBCol md="3">
                            <h5 className="title">Dienste</h5>
                            <hr className="agency-red mb-4 mt-0 d-inline-block" />
                            <ul>
                            <Link to="/service/online-presence">
                                <li className="list-unstyled">
                                    <MDBIcon icon="globe" />Online-Präsenz
                                </li>
                            </Link>
                            <Link to="/service/events">
                                <li className="list-unstyled">
                                    <MDBIcon icon="handshake" />Events / Messen
                                </li>
                            </Link>
                            <Link to="/service/wedding">
                                <li className="list-unstyled">
                                    <MDBIcon icon="ring" />Ihre Hochzeit
                                </li>
                            </Link>
                            <Link to="/service/image">
                                <li className="list-unstyled">
                                    <MDBIcon icon="user-tie" />Ihr Image
                                </li>
                            </Link>
                            <Link to="/printing">
                                <li className="list-unstyled">
                                    <MDBIcon icon="vector-square" />3D Druck Service
                                    <MDBBadge pill color="success" className="ml-2">
                                    New
                                    </MDBBadge>
                                </li>
                            </Link>
                            </ul>
                        </MDBCol>
                        <MDBCol md="3">
                            <h5 className="title">Nützliche Links</h5>
                            <hr className="agency-red mb-4 mt-0 d-inline-block" />
                            <ul>
                            <Link to="/kisy">
                                <li className="list-unstyled">
                                    <MDBIcon icon="user" />Kundenportal
                                </li>
                            </Link>
                            <Link to="/faq">
                                <li className="list-unstyled">
                                    <MDBIcon icon="question" />FAQ
                                </li>
                            </Link>
                            <Link to="/blog">
                                <li className="list-unstyled">
                                    <MDBIcon icon="rss" />Blog
                                </li>
                            </Link>
                            <a 
                            href="https://github.com/aichner/React-MDB-Template/blob/master/CONTRIBUTING.md"
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                                <li className="list-unstyled">
                                    <MDBIcon icon="code" />Code quality
                                </li>
                            </a>
                            <a 
                            href="https://www.buymeacoffee.com/M4SVRWQ"
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                                <li className="list-unstyled">
                                    <MDBIcon icon="coffee" />Einen Kaffee spendieren
                                </li>
                            </a>
                            <Link to="/branding">
                                <li className="list-unstyled">
                                    <MDBIcon icon="palette" />Presse / Branding
                                </li>
                            </Link>
                            </ul>
                        </MDBCol>
                        <MDBCol md="4">
                            <h5 className="title">Kontakt</h5>
                            <hr className="agency-red mb-4 mt-0 d-inline-block" />
                            <ul>
                            <Link to="/location">
                                <li className="list-unstyled">
                                    <MDBIcon icon="home" />Villach, Kärnten, AT
                                </li>
                            </Link>
                            <a href="mailto:info@aichner-christian.com">
                                <li className="list-unstyled">
                                    <MDBIcon far icon="envelope" />info@aichner-christian.com
                                </li>
                            </a>
                            <a href="tel:004368120502754">
                                <li className="list-unstyled">
                                    <MDBIcon icon="phone" />+43 681 205027 54
                                </li>
                            </a>
                            <hr />
                            <Link to="/about">
                                <li className="list-unstyled">
                                    <MDBIcon far icon="file-alt" />Impressum
                                </li>
                            </Link>
                            <Link to="/privacy">
                                <li className="list-unstyled">
                                    <MDBIcon icon="balance-scale" />Datenschutzerklärung
                                </li>
                            </Link>
                            <Link to="/terms">
                                <li className="list-unstyled">
                                    <MDBIcon icon="balance-scale" />Terms of Service
                                </li>
                            </Link>
                            </ul>
                        </MDBCol>
                        <MDBCol md="12" className="text-center my-5">
                            <h4>{this.state.slogan}</h4>
                            <MDBBtn size="lg" rounded color="primary">Kontakt</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <div className="footer-copyright text-center py-3">
                    <MDBContainer fluid>
                        &copy; 2019 - {new Date().getFullYear()} Copyright: Werbeagentur Christian Aichner
                        <p className="my-2 font-weight-bold madeby">
                          Made with <MDBIcon 
                          icon="heart"
                          className="pulse red-text"
                          aria-hidden="true"
                          /> by <a 
                          href="https://www.aichner-christian.com"
                          target="_block"
                          >us</a>.
                        </p>
                    </MDBContainer>
                </div>
            </MDBFooter>
        )
    }
}

export default Footer;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
