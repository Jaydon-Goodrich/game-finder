var topTenBoxEl = document.querySelector("#top-ten");
var reviewEl = document.querySelector("#review");
var searchEl = document.querySelector("#userSearch");
var searchText = document.querySelector("#gameSearch");
var searchResultEl = document.querySelector("#search-result");
var pastSearches = JSON.parse(localStorage.getItem("searches")) || [];

var modal = document.querySelector("#modal");
var modalOverlay = document.querySelector("#modal-overlay");
var closeButton = document.querySelector("#close-button");
var openButton = document.querySelector("#open-button");
var modalReviewTitle = document.querySelector("#modal-review-title");
var modalBody = document.querySelector("#modal-body");
var modalTitle = document.querySelector("#modal-title");
var reviewAuthor = document.querySelector("#review-author");
var modalImage = document.querySelector("#modal-image");
var MainCard = document.querySelector("#main-card");



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
    var gameBoxEl = document.createElement("div");
    gameBoxEl.setAttribute("id", "open-button");

    var preFormatedGameTitle = gameDetails.name;
    var formatedGameTitle = preFormatedGameTitle.toLowerCase().split(" ").join("%");
    gameBoxEl.setAttribute("data-id", formatedGameTitle);
    gameBoxEl.setAttribute("class", "pure-u-1 pure-u-sm-1-3 pure-u-md-1-2 pure-u-lg-1-8 tiles");

    var gameTitleEl = document.createElement("h2");
    gameTitleEl.textContent = gameDetails.name;
    gameBoxEl.appendChild(gameTitleEl);

    var gameScoreEl = document.createElement("p");
    gameScoreEl.textContent = `Metacritic score: ${gameDetails.metacritic}`;
    gameBoxEl.appendChild(gameScoreEl);

    var gameEsrbEl = document.createElement("p");
    var gameRating = gameDetails.esrb_rating;
    if (!gameRating) {
        gameEsrbEl.textContent = `ESRB rating: NR`;
    }
    else {
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
            response.json().then(function (data) {
                createMainCard(data);
            });
        })
        .catch(err => {
            console.log(err);
        });
}


var searchSubmit = function (event) {
    event.preventDefault();
    var gameTitle = {}
    gameTitle.name = searchText.value.trim();
    if (gameTitle) {
        gameTitle.slug = gameTitle.name.toLowerCase().split(" ").join("-");

        getGameDetails(gameTitle.slug);
        pastSearches.push(gameTitle);
        localStorage.setItem("searches", JSON.stringify(pastSearches));
        console.log(pastSearches);
    }
    searchText.value = "";
}

var createModal = function (gameId) {
    fetch(`https://cors-anywhere.herokuapp.com/https://www.gamespot.com/api/reviews/?api_key=348220cf9009bada78dfe5eae2cfb56639f4b00b&format=json&limit=1&filter=title:${gameId}`
    )
        .then(response => {
            response.json().then(function (data) {
                //Create a brief review
                if (data.number_of_total_results === 0) {
                    var gameIdTitle = gameId.toUpperCase().split("%").join(" ");
                    modalTitle.textContent = gameIdTitle;
                    modalReviewTitle.textContent = "";
                    reviewAuthor.textContent = "";
                    modalImage.setAttribute("src", "");
                    modalBody.innerHTML = "There are no reviews for this game title";
                    openModal();
                }
                else {

                    var longString = data.results[0].body;
                    var shortString = longString.substr(0, 350);
                    var ReviewTitle = data.results[0].title;
                    var bodyReview = shortString;
                    var fullReview = document.createElement("a");
                    fullReview.textContent = "...See Full Article HERE";
                    fullReview.setAttribute("href", data.results[0].site_detail_url);
                    fullReview.setAttribute("target", "_blank");

                    //Game Details
                    var gameTitle = data.results[0].game["name"];
                    var author = data.results[0].authors;

                    //Set the Image URL
                    var imgUrl = data.results[0].image["screen_tiny"];
                    modalImage.setAttribute("src", imgUrl);

                    //Add the details to the modal
                    modalBody.innerHTML = bodyReview;
                    modalTitle.textContent = gameTitle;
                    modalReviewTitle.textContent = ReviewTitle;
                    reviewAuthor.textContent = "By: " + author;
                    modalBody.appendChild(fullReview);
                    openModal();
                }
            })
        })
        .catch(err => {
            console.log(err);
        });
}

var openModal = function () {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
}



searchEl.addEventListener("submit", searchSubmit);

topTenBoxEl.addEventListener("click", function (e) {

    if (e.target.closest("#open-button")) {
        var gameTitleFormat = e.target.closest("#open-button").getAttribute("data-id");
        createModal(gameTitleFormat);
    }

});

getTopTen();

closeButton.addEventListener("click", function () {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
});
