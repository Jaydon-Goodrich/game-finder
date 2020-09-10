var API_KEY = config.API_KEY;
console.log(API_KEY);

var displayTopFive = function() {
    fetch(`https://api-v3.igdb.com/age_ratings`)
    .then(response => {
        console.log(response.data);
    })
    .catch(err => {
        console.error(err);
    });

}

displayTopFive();