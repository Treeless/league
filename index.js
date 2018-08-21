(function() {
    // Author: Matthew Rowlandson
    // Purpose: Server side for league of legends application

    // If I have time, things I want to change, use promises and async/await to make this more cleaner
    //      move certain logic into its own libraries

    const express = require("express");
    const bodyParser = require("body-parser")

    const PORT = 8080;

    const app = express();
    const leagueLib = require("./lib/league.lib.js");

    var static = {}; //information loaded from riot (see league.lib.js : getStaticLeagueData() )

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
                    if (err) { return res.json({ err: err }) }

                    // Now Trim down to only the specific data we need for the front end,,and get the specific information we need
                    var trimmedDetailedMatchList = detailedMatchList.map(function(detailedMatch) {
                        var data = {
                            outcome: null,
                            gameId: detailedMatch.gameId,
                            gameLength: detailedMatch.gameDuration,
                            summonerName: null,
                            summonerSpellRunes: [],
                            championPlayed: null,
                            KDA: 0.00,
                            championLevel: 0,
                            totalCreepScore: 0,
                            creepScorePerMin: 0
                        };

                        // Go through participantIdentities
                        //  player.accountID
                        //  get participantId and store
                        var participantId = null;
                        for (var i = 0; i < detailedMatch.participantIdentities.length; i++) {
                            var participant = detailedMatch.participantIdentities[i];
                            if (participant.player.accountId == account.accountId) {
                                participantId = participant.participantId;
                                data.summonerName = participant.player.summonerName;
                                break;
                            }
                        }
                        if (participantId == null) {
                            console.log("COULD NOT FIND PARTICIPANT ID")
                            return null;
                        }

                        //Using the participant id, go through participants array an find our participant
                        var player = null;
                        for (i = 0; i < detailedMatch.participants.length; i++) {
                            var participant = detailedMatch.participants[i];
                            if (participant.participantId == participantId) {
                                player = participant;
                                break;
                            }
                        }

                        if (player == null) {
                            console.log("COULD NOT FIND PARTICIPANT ID of ", participantId, " in player array")
                            return null;
                        }

                        // Okay, now get the information we need
                        data.outcome = player.stats.win;
                        data.gameLength = data.championName = player.championId; //[name lookup required]
                        data.summonerSpellRunes = player.runes; //[Name lookups required] {ART via name, difficult to lookup}
                        data.kills = player.stats.kills;
                        data.deaths = player.stats.deaths;
                        data.assists = player.stats.assists;
                        data.KDA = ((data.kills + (data.assists / 3)) / data.deaths); //[(K+(A/3)]/D)

                        var itemAPI = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/";
                        data.items = [
                            itemAPI + player.stats.item0 + ".png",
                            itemAPI + player.stats.item1 + ".png",
                            itemAPI + player.stats.item2 + ".png",
                            itemAPI + player.stats.item3 + ".png",
                            itemAPI + player.stats.item4 + ".png",
                            itemAPI + player.stats.item5 + ".png",
                            itemAPI + player.stats.item6 + ".png"
                        ]; //[name lookups required]
                        data.championLevel = player.stats.champLevel;
                        data.totalCreepScore = player.stats.totalMinionsKilled;
                        data.creepScorePerMin = data.totalCreepScore / (data.gameLength);

                        // Okay, now lets lookup the informantion that is only currently as IDs
                        //This information will be in memory, as at the start of our node server
                        //  we populate these static pieces of data/
                        // NOTE: In the future, save this data locally to json files that can be loaded in. 
                        //       Request updates every few days.

                        //TODO. Had issues finding all the little files
                        //      I needed to download and parse into order to find the names of the images to load, or names to display.

                        return data;
                    });

                    //NOTE TO SELF: Front end will probably need some sort of loading screen 
                    //               while we get the detailed data (takes a few seconds).
                    res.json({ account: account, matches: trimmedDetailedMatchList });
                })
            });
        });
    });

    //Setup the server to be listening on var PORT)
    app.listen(PORT, function() {
        console.log("App is listening on port", PORT);

        // TODO: Get league of legends static data.
        //   Check if we have it locally stored
        //   if not do API call. (THIS gets heavily rate limited for up to an hour.)
        // API has been DEPRECATED
        console.log("Retrieving league of legends static data...");
        leagueLib.getStaticLeagueData(function(staticData) {
            static = staticData;
        });
    });
}());