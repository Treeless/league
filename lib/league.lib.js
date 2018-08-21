(function() {
    const http = require('http');
    const API = "na1.api.riotgames.com"; //TODO (waiting for game client)
    const API_KEY = ""; //Hardcoded for DEMO purposes only

    module.exports = {
        getAccountBySummonerName: function(summonerName) {
            //TODO
            http.get(API + "/lol/summoner/v3/summoners/by-name/" + summonerName + "?api_key=" + API_KEY, (resp) => {
                let data = '';

                //data from api (one piece at a time...);
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // All the data was retreived from league api
                resp.on('end', () => {
                    console.log(JSON.parse(data));
                    res.json(data);
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
                // TODO handle specific errors from the API eg status_code=401 etc
            });
        },
        getMatchesByAccountId: function(accountId) {
            //TODO
        }
    };
}());