(function() {
    // Author: Matthew Rowlandson
    // Purpose: Server side for league of legends application
    const express = require("express");
    const bodyParser = require("body-parser")

    const PORT = 8080;

    const app = express();
    const leagueLib = require("./lib/league.lib.js");

    app.use(bodyParser.json()); //JSON middleman

    // CORS
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    //Route to get user match statistics from League of legends API
    // NOTE: in order to use the API, you have to install the game client and pick a summoner name! DOH (Takes a bit to DL)
    app.get("/api/:summonerName/matches.json", function(req, res) {
        var summonerName = req.params.summonerName;

        if (!summonerName) { return res.json({ err: "Please enter a summoner name" }) }

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
                    var trimmedDetailedMatchList = detailedMatchList.map(function(detailedMatch) {
                        var data = {
                            outcome: "victory",
                            gameLength: 0,
                            summonerName: "name",
                            summonerSpellsRunes: [],
                            championPlayed: "name",
                            KDA: 0.00,
                            itemsBought: [],
                            championLevel: 0,
                            totalCreepScore: 0,
                            creepScorePerMin: 0
                        };

                        // Go through participantIdentities
                        //  player.accountID
                        //  get participantId and save

                        //Using the participant id, go through participants array an find our participant
                        // Save win: stats.win championId [name lookup req], runes (runeId, rank), KDA (via stats(kills, deaths, assists), items (stats.item0..6 [names lookup req]), championLevel (stats.champLevel), totalCreepScore: totalMinionsKilled, creepScorePerMin: totalMinionsKilled/(gameLength/60) )
                        //

                    });

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