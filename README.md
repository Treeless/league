# League Application
Displaying match statistics for the given League of Legends player. Learning ReactJS as I go.

## To run the project:

* `npm install && gulp`
* Type in your summoner name you want to lookup (note: no loading icon)

## Issues:
* Retrieving some of the champion, items, spells visual information (names, pics etc) via the static api was thrwarted for a while when I was rate limited for an hour. Apparently you can't call this endpoint more then a few times. I will be storing the data in a json file when I retrieve it next. STATIC rate limit: 10 requests / 1 hour
* Some of the images don't load from their API. Each different item, rune, spell, champions etc requires a totally different code processing to get displayed on the frontend. I ended up running out of time trying to get it all completed. (4-5 hour limit)
* [FIXED] CORS issue when making an api call from clientside 
* [FIXED] Couldn't figure out why JSX wasn't working, forgot to include Babel.js to transcompile..

## What I would change given more time:
* Lots and lots of polish required.
* Load in all the meta data required to display properly on front end
* Use promises instead of passing a function to library calls, as well as use async/await for most of the server side code.
* Polished frontend CSS. Make responsive, I should have used bootstrap or foundation.
* Rate limiting monitoring. (I ran into being rate limited and having to work on other parts while I waited)
* Loading icon on search of summoner
* Full validation and error checking
* Automated testing for league.lib.js
* Frontend testing
* Better front end project structure rather then 1 file
* Deploy to AWS or Digital Ocean 
* Save session of user and the summoners they looked up
* Display more meta data related to each match (towers fallen, etc)