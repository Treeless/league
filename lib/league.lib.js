(function() {
    const https = require('https');
    const async = require('async');
    const API = "https://na1.api.riotgames.com"; //TODO (waiting for game client)
    const API_KEY = "RGAPI-0e0809f3-b5f0-4c1e-959a-96234b11c18d"; //Hardcoded for DEMO purposes only
    //Note: Expires: Wed, Aug 22nd, 2018 @ 2:00am (PT)

    var get = function(url, done) {
        url = url + "?api_key=" + API_KEY;
        https.get(url, (resp) => {
            let data = '';

            //data from api (one piece at a time...);
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // All the data was retreived from league api
            resp.on('end', () => {
                // console.log(JSON.parse(data));
                done(null, JSON.parse(data));
            });

        }).on("error", (err) => {
            console.log(err);
            console.log("Error: " + err.message);
            done(err.message);
            // TODO handle specific errors from the API eg status_code=401 etc
        });
    }

    module.exports = {
        getStaticLeagueData: function(done) {

            // Lookup via ids
            var static = { "champions": {}, "items": {}, "runes": {}, "summonerSpells": {} };

            // This will be called on the start of our application
            // Static data to retrieve:
            // * champions     via /lol/static-data/v3/champions
            // * items         via /lol/static-data/v3/items
            // * runes         via /lol/static-data/v3/runes
            // * summonerSpells via /lol/static-data/v3/summoner-spells

            var champ_url = API + "/lol/static-data/v3/champions";
            var items_url = API + "/lol/static-data/v3/items";
            var runes_url = API + "/lol/static-data/v3/runes";
            var summoner_spells_url = API + "/lol/static-data/v3/summoner-spells";

            //FIRST: Champions
            get(champ_url, function(err, data) {
                if (err) { console.log(err); return done(err); }
                var champions = data.data;

                if(champions == null){
                    console.log("We are being rate limited...");
                }

                // The data comes in keyed as: {name: {}, ...}
                // We need id: name
                Object.keys(champions).map(function(name) {
                    static.champions[champions[name].id] = name;
                });

                //SECOND: ITEMS
                // Note: At this point, after testing a bunch, I've been rate limited for an hour. Going to come back to this.
                get(items_url, function(err, data) {
                    if (err) { console.log(err); return done(err); }
                    console.log(data.data);

                    done(null, static);
                })
            });
        },
        getAccountBySummonerName: function(summonerName, done) {
            var url = API + "/lol/summoner/v3/summoners/by-name/" + encodeURI(summonerName);
            get(url, done);
        },
        getMatchesByAccountId: function(accountId, done) {
            var url = API + "/lol/match/v3/matchlists/by-account/" + accountId;
            get(url, function(err, data) {
                if (err) {
                    return done(err);
                }

                done(null, data.matches);
            });
        },
        getMatchByMatchId: function(matchId, done) {
            // Note: Riot only allows you to get one match at a time
            var url = API + "/lol/match/v3/matches/" + matchId;
            get(url, done);
        },
        getMatchesByList: function(matchIds, done) {
            var self = this;
            // The riot API has a rate limit of 500 requests / 10 seconds
            //    or 20 calls per 1 sec

            //Using Async for our calls
            var tasks = [];

            //Create the tasks for the async system
            for (var i = 0; i < matchIds.length; i++) {
                // Each task gets the specific match ID scoped for each call
                tasks.push(function(matchId) {
                    return function(cb) {
                        self.getMatchByMatchId(matchId, function(err, matchData) {
                            cb(err, matchData);
                        });
                    };
                }(matchIds[i]));
            }

            //Call each request one after another
            async.series(tasks, function(err, data) {
                if (err) {
                    done(err);
                } else {
                    done(null, data);
                }
            })
        }
    };
}());