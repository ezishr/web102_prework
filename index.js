/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for(let i=0; i < games.length; i++){

        // create a new div element, which will become the game card
        const game_card = document.createElement('div')
        const game = games[i]

        // add the class game-card to the list
        game_card.classList.add('game-card')

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        game_card.innerHTML = `
            <img src = "${game.img}" alt = "${game.name}" class = "game-img">
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <p>Pledged: $${game.pledged}</p>
            <p>Goal: $${game.goal}</p>
            <p>Backers: ${game.backers}</p>
        `;

        // append the game to the games-container
        gamesContainer.appendChild(game_card);
    }

}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
contributionsCard.innerHTML = (GAMES_JSON.reduce( (acc,game) => {
    return acc + game.backers
},0)).toLocaleString('en-US')

// set the inner HTML using a template literal and toLocaleString to get a number with commas


// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

// set inner HTML using template literal
raisedCard.innerHTML = '$' + (GAMES_JSON.reduce( (acc,game) => {
    return acc + game.pledged
},0)
).toLocaleString('en-US')
// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = (GAMES_JSON.length).toLocaleString('en-US')

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const notMetGoal = GAMES_JSON.filter((game) => {
        return game.pledged < game.goal
    })
    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(notMetGoal)
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const haveFundedOnly = GAMES_JSON.filter((game) => {
        return game.pledged > game.goal
    })
    
    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(haveFundedOnly)
}
// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON)
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly)
fundedBtn.addEventListener('click', filterFundedOnly)
allBtn.addEventListener('click', showAllGames)

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games

// const num = GAMES_JSON.filter((game) => {
//     return game.pledged < game.goal
// }).length

const numUnfundedGame = GAMES_JSON.reduce( (acc,game) => {
    if (game.pledged < game.goal) {
        return acc + 1
    } else {return acc}
},0)


// create a string that explains the number of unfunded games using the ternary operator
let currentFundedGame = (GAMES_JSON.filter((game) => {return game.pledged > game.goal})).length
let currentUnfundedGame = (GAMES_JSON.filter((game) => {return game.pledged < game.goal})).length
let fundedGameMoney = (GAMES_JSON.reduce( (acc,game) => {
    if (game.pledged > game.goal) {
        return acc + game.pledged
    } else {return acc}
},0)).toLocaleString('en-US');


const displayStr = `
    ${(GAMES_JSON.length === currentFundedGame) ? `All 11 games are funded. Thank you for your fund!` : `A total of $${fundedGameMoney} has been raised to ${currentFundedGame} ${currentFundedGame >0 ? 'games' : 'game'}. We have ${currentUnfundedGame} ${currentUnfundedGame > 1 ? 'remain' : 'remains'} unfunded. We need your help to fund these amazing ${currentUnfundedGame > 0 ? 'games' : 'game'}!`}
`

// console.log(`Current number of funded games ${currentFundedGame}`)
// console.log(`Current number of UNfunded games ${currentUnfundedGame}`)
// console.log(`Current money of funded game ${fundedGameMoney}`)
// console.log(displayStr)

// create a new DOM element containing the template string and append it to the description container
const new_para = document.createElement('p')
new_para.innerHTML = displayStr
descriptionContainer.appendChild(new_para)


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...otherGames] = sortedGames


// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameName = document.createElement('p')
firstGameName.textContent = firstGame.name
firstGameContainer.appendChild(firstGameName)

const secondGameName = document.createElement('p')
secondGameName.textContent = secondGame.name
secondGameContainer.appendChild(secondGameName)
// do the same for the runner up item