(function() {
    // Author: Matthew Rowlandson
    // Purpose: Server side for league of legends application
    const Express = require("express");
    const PORT = 8080;
    const app = Express();

    //Route to get user match statistics from League of legends API
    app.get("/account/:username", function(req, res) {
        // TODO
    });

    //Setup the server to be listening on var PORT)
    app.listen(PORT, function() {
        console.log("App is listening on port", PORT)
    });
}());