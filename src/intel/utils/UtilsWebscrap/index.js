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
