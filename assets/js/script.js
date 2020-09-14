var topTenBoxEl = document.querySelector("#top-ten");
var reviewEl = document.querySelector("#review");
var searchEl = document.querySelector("#userSearch");
var searchText = document.querySelector("#gameSearch");
var searchResultEl = document.querySelector("#search-result");

var modal = document.querySelector("#modal");
var modalOverlay = document.querySelector("#modal-overlay");
var closeButton = document.querySelector("#close-button");
var openButton = document.querySelector("#open-button");

var getTopTen = function () {
    fetch("https://rawg-video-games-database.p.rapidapi.com/games", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com",
            "x-rapidapi-key": "b26c93ba6cmshec93fde4486eaf6p1c7506jsn8451a97d31ae"
        }
    })
        .then(response => {
            response.json().then(data => {
                displayTopTen(data.results);
            })
        })
        .catch(err => {
            console.log(err);
        });
}

var displayTopTen = function (gameDataArr) {
    for (var i = 9; i >= 0; i--) {
        getGameDetails(gameDataArr[i].slug);
    }
}

var createMainCard = function (gameDetails) {
    console.log(gameDetails);
    var gameBoxEl = document.createElement("div");
    gameBoxEl.setAttribute("id", gameDetails.slug);

    var gameCardEl = document.createElement("div");
    gameBoxEl.setAttribute("class", "pure-u-1 pure-u-sm-1-3 pure-u-md-1-2 pure-u-lg-1-8 tiles");

    var gameTitleEl = document.createElement("h2");
    gameTitleEl.textContent = gameDetails.name;
    gameBoxEl.appendChild(gameTitleEl);

    var gameScoreEl = document.createElement("p");
    gameScoreEl.textContent = `Metacritic score: ${gameDetails.metacritic}`;
    gameBoxEl.appendChild(gameScoreEl);

    var gameEsrbEl = document.createElement("p");
    var gameRating = gameDetails.esrb_rating;
    if(gameRating === null){
        gameEsrbEl.textContent = `ESRB rating: NR`;
    }
    else{
        gameEsrbEl.textContent = `ESRB rating: ${gameRating.name}`;
    }
    
    gameBoxEl.appendChild(gameEsrbEl);

    





    topTenBoxEl.prepend(gameBoxEl);
}

var getGameDetails = async function (gameName) {
    await fetch(`https://rawg-video-games-database.p.rapidapi.com/games/${gameName}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com",
            "x-rapidapi-key": "b26c93ba6cmshec93fde4486eaf6p1c7506jsn8451a97d31ae"
        }
    })
        .then(async (response) => {
            response.json().then(function(data) {
                createMainCard(data);
            });
        })
        .catch(err => {
            console.log(err);
        });
}


var searchSubmit = function (event) {
    event.preventDefault();
    var gameTitle = searchText.value.trim();
    if (gameTitle) {
        var game = gameTitle.toLowerCase().split(" ").join("-");
        getGameDetails(game);

    }
    searchText.value = "";

}


fetch("https://cors-anywhere.herokuapp.com/https://www.gamespot.com/api/reviews/?api_key=348220cf9009bada78dfe5eae2cfb56639f4b00b&format=json&limit=2&filter=title:call%of%duty%warzone"
)
.then(response => {
	response.json().then(function (data){
        console.log(data);
        var bodyReview = data.results[0].body;
        searchEl.innerHTML = bodyReview;
    })
})
.catch(err => {
	console.log(err);
});

searchEl.addEventListener("submit", searchSubmit);


//getTopTen();
closeButton.addEventListener("click", function() {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
  });
  
  openButton.addEventListener("click", function() {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
  });
