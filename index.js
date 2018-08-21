(function() {
    // Author: Matthew Rowlandson
    // Purpose: Server side for league of legends application
    const Express = require("express");
    const http = require('http');

    const PORT = 8080;
    const API = ""; //TODO (waiting for game client)
    const API_KEY = ""; //Hardcoded for DEMO ONLY

    const app = Express();

    //Route to get user match statistics from League of legends API
    // NOTE: in order to use the API, you have to install the game client and pick a summoner name! DOH (Takes a bit to DL)
    app.get("/account/:username", function(req, res) {
        var username = req.params.username;

        http.get(API + "?api_key=" + API_KEY, (resp) => {
            let data = '';

            //data from api (one piece at a time...);
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // All the data was retreived from league api
            resp.on('end', () => {
                console.log(JSON.parse(data));
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    });

    //Setup the server to be listening on var PORT)
    app.listen(PORT, function() {
        console.log("App is listening on port", PORT)
    });
}());