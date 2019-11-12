//> Send request functions
// Proxy to bypass CORS
const proxy = "https://c-hive-proxy.herokuapp.com/";

// Fetch JSON from url
const fetchJson = (urlIn) => {
    const url = `${proxy}${urlIn}`;
    return fetch(url, {
        headers: {
            Accept: "application/json, text/plain, */*",
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then((res) => res.json())
        .then((res) => {
            return res;
        });
};

// Fetch HTML from url
const fetchHtml = (urlIn) => {
    const url = `${proxy}${urlIn}`;
    return fetch(url, {
        headers: {
            Accept: "application/json, text/plain, */*"
        }
    })
        .then((res) => res.text())
        .then((res) => {
            return res;
        });
};

//> Parser functions
// Parse Json to DOM Object
const parseJsonToDOM = (json) => {
    const parser = new DOMParser();
    const html = json.then((res) => {
        return parser.parseFromString(res.html, "text/html");
    });
    return html;
};

//Parse plain text to DOM Object
const parseTextToDOM = (json) => {
    const parser = new DOMParser();
    const html = json.then((res) => {
        return parser.parseFromString(res, "text/html");
    });
    return html;
};
