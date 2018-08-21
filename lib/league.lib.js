(function() {
    const https = require('https');
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
                console.log(JSON.parse(data));
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
            get(url, done);
        },
        getMatchByMatchId: function(matchId, done) {
            // Note: Riot only allows you to get one match at a time
            var url = API + "/lol/match/v3/matches/" + matchId;
        },
        getMatchesByList: function(matchIds, done){
          // The riot API has a rate limit of 500 requests / 10 seconds
          // TODO
        }
    };
}());