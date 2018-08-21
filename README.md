# League Application
Displaying match statistics for the given League of Legends player

## To run the project:

* `npm install && gulp`
* Type in your summoner name you want to lookup

## Issues:
* Couldn't figure out why JSX wasn't working, forgot to include Babel.js to transcompile..
* Retrieving some of the champion, items, spells visual information (names, pics etc) via the static api was thrwarted for a while when I was rate limited for an hour. Apparently you can't call this endpoint more then a few times. I will be storing the data in a json file when I retrieve it next. STATIC rate limit: 10 requests / 1 hour
* [FIXED] CORS issue when making an api call from clientside 
