// index.js File

// imports
import * as connect from "./connectgql"
//import './connectgql';

export function get(username) {
    return connect.get(username)
}

//export const test = (username) => (connect.get(username));

// ConnectivityTest start

function ConnectivityTest() {

    return "ConnectionTest!";
  
}

// ConnectivityTest stop

console.log(ConnectivityTest());

