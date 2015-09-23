var fs = require('fs');
var request = require('request');
var _ = require('underscore');
var validator = require('url-validator');

//make cache dir if not present
try {
    fs.readdirSync('cache');
} catch(e) {
    fs.mkdirSync('cache'); 
}

request('http://www.reddit.com/r/pics/new.json', function(error, response, data) {
    if (!error && response.statusCode == 200) {
        data = JSON.parse(data);
        _.each(data.data.children, function(ele) {
            var fileNameArr = ele.data.thumbnail.split("/");
            var fileName = fileNameArr[fileNameArr.length-1];
            if (validator(ele.data.thumbnail)) {
                console.log("fetching: " + ele.data.thumbnail);
                request(ele.data.thumbnail).pipe(fs.createWriteStream('cache/' + fileName));
            }
        });
    } else {
        console.log('api failed to fetch data');
    }
});