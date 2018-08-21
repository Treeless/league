(function() {
    // Author: Matthew Rowlandson
    // Purpose: Server side for league of legends application
    const express = require("express");
    const bodyParser = require("body-parser")

    const PORT = 8080;

    const app = express();
    const leagueLib = require("./lib/league.lib.js");

    app.use(bodyParser.json()); //JSON middleman

    //Route to get user match statistics from League of legends API
    // NOTE: in order to use the API, you have to install the game client and pick a summoner name! DOH (Takes a bit to DL)
    app.get("/matches/:summonerName", function(req, res) {
        var summonerName = req.params.summonerName;

        // FIRST: make a call to get the user's accountId
        leagueLib.getAccountBySummonerName(summonerName, function(err, account) {
            // SECOND: Now, using the accountId, get list of matches (10)
            leagueLib.getMatchesByAccountId(account.accountId, function(err, matches) {
                res.json({ account: account, matches: matches });
            });
        });
    });

    //Setup the server to be listening on var PORT)
    app.listen(PORT, function() {
        console.log("App is listening on port", PORT)
    });
}());