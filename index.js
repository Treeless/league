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
            console.log("get account information by summonerName:", summonerName)
            if (err) { return res.json({ err: err }) }
            // SECOND: Now, using the accountId, get list of matches (10)
            leagueLib.getMatchesByAccountId(account.accountId, function(err, matches) {
                console.log("get matches by accountId:", account.accountId);
                if (err) { return res.json({ err: err }) }

                // Get the last 10 match Ids
                var matchIds = matches.map(function(match) {
                    return match.gameId;
                });

                ///We only care about the last 10 (for now.. paging can come later via API)
                matchIds = matchIds.slice(0, (matchIds.length < 10) ? matchIds.length : 10);

                //THIRD: get the match information for the list of match ids
                leagueLib.getMatchesByList(matchIds, function(err, detailedMatchList) {
                    console.log("get detailed match list: length", detailedMatchList.length);
                    if (err) { return res.json({ err: err }) }

                    // TODO: Trim down to only the specific data we need for the front end

                    //NOTE TO SELF: Front end will probably need some sort of loading screen 
                    //               while we get the detailed data (takes a few seconds).
                    res.json({ account: account, matches: detailedMatchList });
                })
            });
        });
    });

    //Setup the server to be listening on var PORT)
    app.listen(PORT, function() {
        console.log("App is listening on port", PORT)
    });
}());