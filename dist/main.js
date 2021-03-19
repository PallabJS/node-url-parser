/* This function can parse most urls into more readable and usable javascript object */
function parseUrl(url) {
    let parsed_url = {
        protocol: "",
        domain: "",
        port: "",
        endpoint: "",
        params: {},
    };

    let url_parts = url.split("?");
    let main = url_parts[0];

    // Parse for portfull urls
    if (main.split(":").length == 3) {
        // protocol
        parsed_url.protocol = main.slice(0, main.indexOf(":"));

        // domain
        parsed_url.domain = main.split("/")[2].split(":")[0];

        // port
        try {
            parsed_url.port = main.match(/:[0-9]+\//)[0].replace(/:|\//g, "");
        } catch (e) {
            parsed_url.port = main.match(/:[0-9]+/)[0].replace(/:|\//g, "");
        }

        // endpoint
        let url_prefix = `${parsed_url.protocol}://${parsed_url.domain}:${parsed_url.port}`;
        parsed_url.endpoint = main.replace(url_prefix, "");
        if (parsed_url.endpoint === "") parsed_url.endpoint = "/";

        // params
        parsed_url.params = getUrlParams(url);

        // parse for portless urls
    } else {
        // This is for address with port
        parsed_url.protocol = main.slice(0, main.indexOf(":"));

        // domain
        parsed_url.domain = main.split("/")[2];

        // Port
        parsed_url.port = null;

        // Endpoint
        parsed_url.endpoint = main.slice(parsed_url.domain.length + parsed_url.protocol.length + "://".length);

        // Params
        parsed_url.params = getUrlParams(url);
    }

    return parsed_url;
}

// Get url params
function getUrlParams(url) {
    /* Parse url parameters. getUrlParams(url: String) */
    params = {};

    let url_parts = url.split("?");
    if (url_parts.length === 1) {
        return params;
    }

    let paramsString = url_parts[1];

    let paramsArray = paramsString.split("&");
    paramsArray.forEach((pair) => {
        let key = pair.substr(0, pair.indexOf("="));
        let value = pair.substr(pair.indexOf("=") + 1);

        // Handle boolean values
        if (typeof value === "string") {
            if (value === "true") value = true;
            if (value === "false") value = false;
        }
        // Handling numeric and floating values
        else if (!isNaN(value)) {
            if (value - parseInt(value) === 0) {
                value = parseInt(value);
            } else {
                value = parseFloat(value).toFixed(2);
            }
        }
        params[key] = value;
    });

    return params;
}

module.exports = { parseUrl };
