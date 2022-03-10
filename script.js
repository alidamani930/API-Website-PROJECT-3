const apiKey = "df384ea577ad1d5327c9c4ce7c67d626";
const form = document.querySelector(".form");
const div = document.querySelector(".info-div");
const selectTeam = document.querySelector("#teams");
const selectSite = document.querySelector("#bet_site");
const selectBet = document.querySelector("#bet_type");

// this is to prevent reloading of page on submit, triggers main function
form.addEventListener("submit", function (e) {
  e.preventDefault();
  oddsFunction();
});

//
// main function
//
function oddsFunction() {
  fetch(
    `https://api.the-odds-api.com/v3/odds/?apiKey=${apiKey}&sport=basketball_nba&region=us&mkt=${selectBet.value}`
  )
    .then(handleErrors)
    .then((res) => res.json())
    .then((data) => getBetInfo(data))
    .then((message) => printMessage(message))
    .catch((error) => errorMessage(error));
}

//
// this function crafts the message for the betting information data
//
function getBetInfo(data) {
  const dataObject = data.data;
  let message = `Sorry, the ${selectTeam.value} do not play today. Please select another team.`;
  const siteNumber = findSiteNumber(selectSite);
  for (i = 0; i < dataObject.length; i++) {
    if (dataObject[i].teams.includes(selectTeam.value)) {
      const teamOne = dataObject[i].teams[0];
      const teamTwo = dataObject[i].teams[1];
      if (selectBet.value == "spreads") {
        const line = dataObject[i].sites[siteNumber].odds.spreads.points[0];
        const sign = line > 0 ? "+" : "";
        message = `For tonight's ${teamOne} vs. ${teamTwo} game, 
             the spread is ${teamOne}(${sign}${line}) 
             according to ${selectSite.value}.`;
      } else if (selectBet.value == "totals") {
        const line = dataObject[i].sites[siteNumber].odds.totals.points[0];
        message = `For tonight's ${teamOne} vs. ${teamTwo} game,
            the Over/Under is (${line})
            according to ${selectSite.value}.`;
      }
    }
  }
  return message;
}

// //
// // this helper function helps decide which betting site's data will be used
// //
function findSiteNumber(site) {
  if (site.value == "FanDuel") {
    siteNumber = 0;
  } else if (site.value == "FOX Bet") {
    siteNumber = 2;
  } else if (site.value == "DraftKings") {
    siteNumber = 3;
  } else if (site.value == "BetMGM") {
    siteNumber = 4;
  } else if (site.value == "Barstool Sportsbook") {
    siteNumber = 7;
  }
  return siteNumber;
}

//
// This function helps to display message in the window
//
function printMessage(message) {
  div.innerHTML = message;
}

//
// Error handling function
//
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

//
// error text handler
//
function errorMessage(error) {
  const errorMessage = `An error occurred: ${error.status}`;
  div.innerHTML = errorMessage;
}

//
// this function crafts the message for the spread data
//
// function getSpread(data) {
//   let message = `Sorry, the ${selectTeam.value} do not play today. Please select another team.`;
//   const siteNumber = findSiteNumber(selectSite);
//   for (i = 0; i < data.data.length; i++) {
//     if (data.data[i].teams.includes(selectTeam.value)) {
//       const teamOne = data.data[i].teams[0];
//       const teamTwo = data.data[i].teams[1];
//       const sign =
//         data.data[i].sites[siteNumber].odds.spreads.points[0] > 0 ? "+" : "";
//       const line = data.data[i].sites[siteNumber].odds.spreads.points[0];
//       message = `For tonight's ${teamOne} vs. ${teamTwo} game,
//       the spread is ${teamOne}(${sign}${line})
//       according to ${selectSite.value}.`;
//     }
//   }
//   return message;
// }

// //
// // this function crafts the message for the over/under data
// //
// function getOU(data) {
//   let message = `Sorry, the ${selectTeam.value} do not play today. Please select another team.`;
//   const siteNumber = findSiteNumber(selectSite);
//   for (i = 0; i < data.data.length; i++) {
//     if (data.data[i].teams.includes(selectTeam.value)) {
//       const teamOne = data.data[i].teams[0];
//       const teamTwo = data.data[i].teams[1];
//       const line = data.data[i].sites[siteNumber].odds.totals.points[0];
//       message = `For tonight's ${teamOne} vs. ${teamTwo} game,
//       the Over/Under is (${line})
//       according to ${selectSite.value}.`;
//     }
//   }
//   return message;
// }
//

//
// this function splits the response depending on which bet type is requested.
//

// function oddsFunction() {
//   if (selectBet.value == "totals") {
//     fetch(
//       `https://api.the-odds-api.com/v3/odds/?apiKey=${apiKey}&sport=basketball_nba&region=us&mkt=${selectBet.value}`
//     )
//       .then(handleErrors)
//       .then((res) => res.json())
//       .then((data) => getOU(data))
//       .then((message) => printMessage(message))
//       .catch((error) => errorMessage(error));
//   } else if (selectBet.value == "spreads") {
//     fetch(
//       `https://api.the-odds-api.com/v3/odds/?apiKey=${apiKey}&sport=basketball_nba&region=us&mkt=${selectBet.value}`
//     )
//       .then(handleErrors)
//       .then((response) => response.json())
//       .then((data) => getSpread(data))
//       .then((message) => printMessage(message))
//       .catch((error) => errorMessage(error));
//   }
// }
