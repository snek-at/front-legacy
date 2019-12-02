//> React
// Contains all the functionality necessary to define React components
import React from "react";

//> Additional packages
// Contains all the functionality necessary to define Typist components
import Typist from "react-typist";

class TextTypist extends React.Component{
  constructor(props) {
    super(props);

    this.state = { 
      active: 0
    };
  }

  componentDidMount = () => {
    this.setState({
      scope: this.props.scope
    });
  }

  onTypingDone = () => {
    this.setState({
      scope: null
    }, () => this.setState({
      scope: this.props.scope
    }));
  };

  render(){
    if(this.state.scope){
      return(
        <Typist 
        className="d-inline typist"
        cursor={{
          show: true,
          blink: true,
          element: "_",
        }}
        onTypingDone={() => this.onTypingDone()}
        >
          <Typist.Delay ms={2000} />
          {this.state.scope.map((text, i) => {
            return (
              <span key={i}>
                {text}
                {<Typist.Backspace count={text.length + 10} delay={2000} />}
              </span>
            );
          })}
        </Typist>
      );
    } else {
      return null;
    }
  }
}

export default TextTypist;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
