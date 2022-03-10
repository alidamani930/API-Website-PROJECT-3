const apiKey = "df384ea577ad1d5327c9c4ce7c67d626";
const form = document.querySelector(".form");
const div = document.querySelector(".info-div");
const selectTeam = document.querySelector("#teams");
const selectSite = document.querySelector("#bet_site");
const selectBet = document.querySelector("#bet_type");

// this is to prevent reloading of page on refresh
form.addEventListener("submit", function (e) {
  e.preventDefault();
  oddsFunction();
});

//
// this function splits the response depending on which bet type is requested.
//
function oddsFunction() {
  if (selectBet.value == "totals") {
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
  // this function crafts the message for the spread data
  //
  function getBetInfo(data) {
    let message = `Sorry, the ${selectTeam.value} do not play today. Please select another team.`;
    const siteNumber = findSiteNumber(selectSite);
    for (i = 0; i < data.data.length; i++) {
      if (data.data[i].teams.includes(selectTeam.value)) {
        const teamOne = data.data[i].teams[0];
        const teamTwo = data.data[i].teams[1];
        if (selectBet.value == "spreads") {
          const line = data.data[i].sites[siteNumber].odds.spreads.points[0];
          const sign =
            data.data[i].sites[siteNumber].odds.spreads.points[0] > 0
              ? "+"
              : "";
          message = `For tonight's ${teamOne} vs. ${teamTwo} game, 
             the spread is ${teamOne}(${sign}${line}) 
             according to ${selectSite.value}.`;
        } else if (selectBet.value == "totals") {
          const line = data.data[i].sites[siteNumber].odds.totals.points[0];
          message = `For tonight's ${teamOne} vs. ${teamTwo} game,
            the Over/Under is (${line})
            according to ${selectSite.value}.`;
        }
      }
    }
    return message;
  }
}
