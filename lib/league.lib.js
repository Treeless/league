(function() {
    const https = require('https');
    const API = "https://na1.api.riotgames.com"; //TODO (waiting for game client)
    const API_KEY = "RGAPI-b73157db-eec0-4eff-b0bf-72c76f444896"; //Hardcoded for DEMO purposes only
    //Note: Expires: Wed, Aug 22nd, 2018 @ 2:00am (PT)

    var makeRequest = function(param, done){
      // TODO  Duplicate code, simplify both functions below after they work
    }

    module.exports = {
        getAccountBySummonerName: function(summonerName, done) {
            var url = API + "/lol/summoner/v3/summoners/by-name/" + encodeURI(summonerName) + "?api_key=" + API_KEY;
            https.get(url, (resp) => {
                let data = '';

                //data from api (one piece at a time...);
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // All the data was retreived from league api
                resp.on('end', () => {
                    console.log(JSON.parse(data));
                    done(null, JSON.parse(data));
                });

            }).on("error", (err) => {
                console.log(err);
                console.log("Error: " + err.message);
                done(err.message);
                // TODO handle specific errors from the API eg status_code=401 etc
            });
        },
        getMatchesByAccountId: function(accountId, done) {
            //NOTE: Duplicate code, simplify both functions
            var url = API + "/lol/match/v3/matchlists/by-account/" + accountId + "?api_key=" + API_KEY;
            https.get(url, (resp) => {
                let data = '';

                //data from api (one piece at a time...);
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // All the data was retreived from league api
                resp.on('end', () => {
                    console.log(JSON.parse(data));
                    done(null, JSON.parse(data));
                });

            }).on("error", (err) => {
                console.log(err);
                console.log("Error: " + err.message);
                done(err.message);
                // TODO handle specific errors from the API eg status_code=401 etc
            });
        },
        getMatchByMatchId: function(matchId, done){
          // TODO
        }
    };
}());