(function() {
    const https = require('https');
    const async = require('async');
    const API = "https://na1.api.riotgames.com"; //TODO (waiting for game client)
    const API_KEY = "RGAPI-b73157db-eec0-4eff-b0bf-72c76f444896"; //Hardcoded for DEMO purposes only
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
                        console.log(matchId);
                        self.getMatchByMatchId(matchId, function(err, matchData) {
                            console.log("call resp: ", err, matchData);
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
                    console.log("Detailed matchlist:", data);
                    done(null, data);
                }
            })
        }
    };
}());