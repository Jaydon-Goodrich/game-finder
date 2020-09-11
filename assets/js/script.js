var topTenBoxEl = document.querySelector("#top-ten");

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
    for (var i = 0; i < 1 && i < gameDataArr.length; i++) {
        // console.log(gameDataArr[i]);

        var gameBoxEl = document.createElement("div");
        gameBoxEl.setAttribute("id", gameDataArr[i].id);

        var gameTitleEl = document.createElement("h2");
        gameTitleEl.textContent = gameDataArr[i].name;
        gameBoxEl.appendChild(gameTitleEl);

        var gameScoreEl = document.createElement("p");
        gameScoreEl.textContent = gameDataArr[i].metacritic;
        gameBoxEl.appendChild(gameScoreEl);

        var gameDetails = getGameDetails(gameDataArr[i]);
        console.log(gameDetails);

        topTenBoxEl.appendChild(gameBoxEl);
    }
}

var getGameDetails = async function (gameData) {
    fetch(`https://rawg-video-games-database.p.rapidapi.com/games/${gameData.slug}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com",
            "x-rapidapi-key": "b26c93ba6cmshec93fde4486eaf6p1c7506jsn8451a97d31ae"
        }
    })
        .then(response => {
            response.json().then(data => {
                return data;
            });
        })
        .catch(err => {
            console.log(err);
        });
}

getTopTen();