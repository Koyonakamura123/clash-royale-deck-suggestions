import './App.css';
import {useState, useEffect} from "react";

function DeckSuggestions(props) {
    const [suggestions, setSuggestions] = useState({});

    function mapLeaderboard(leaderboard) {
        const newLeaderboard = [];
        for(var i = 0; i < leaderboard.length; i++) {
            const deck = [];
            if(leaderboard[i].hasOwnProperty("name")) { // probably a rate limit issue - missing some ranking after 72
                for(var j = 0; j < leaderboard[i]["currentDeck"].length; j++) {
                    const cardInfo = {};
                    cardInfo["name"] = leaderboard[i]["currentDeck"][j]["name"];
                    cardInfo["maxLevel"] = leaderboard[i]["currentDeck"][j]["maxLevel"];
                    cardInfo["iconUrl"] = leaderboard[i]["currentDeck"][j]["iconUrls"]["medium"];
                    deck.push(cardInfo); // e.g., ["Knight", "13", "KnightIcon.png"]
                }
                const infoDict = {};
                infoDict["rank"] = i + 1;
                infoDict["name"] = leaderboard[i]["name"];
                infoDict["currentTrophiesBest"] = leaderboard[i]["leagueStatistics"]["currentSeason"]["bestTrophies"]; //highest rank achieved this season - can be undefined
                infoDict["deck"] = deck;
                newLeaderboard.push(infoDict);
            }
        }
        return newLeaderboard;
    }

    // returns an integer representing match level, based on sum of (current card level - max card level). 0 = perfect match, -1 = close to perfect, -10 = far from perfect, etc.
    function calculateMatch(deck, cards) {
        var match = 0;
        for(var i = 0; i < deck.length; i++) {
            const cardName = deck[i]["name"];
            if(!(cardName in cards)) { // i.e. if player hasn't unlocked card yet, don't recommend
                match += -1000;
            } else {
                match += (cards[cardName] - deck[i]["maxLevel"]); // 0 if max level, -1 if 1 off from max level, etc.
            }
        }
        return match;
    }

    // rules for comparing matches - first sort by higher match (closer to 0), then by player rank
    function compare(a, b) {
        if(a["match"] > b["match"]) {
            return -1;
        } else if(a["match"] < b["match"]) {
            return 1;
        } else if(a["deckPlayerInfo"]["rank"] > b["deckPlayerInfo"]["rank"]) {
            return -1;
        } else {
            return 1;
        }
    }

    // updates suggestions after sorting them based on match
    function sortSuggestions(matchesArray) {
        const sortedMatches = matchesArray.sort(compare);
        const suggestionDict = {};
        suggestionDict["player"] = props.id;
        suggestionDict["suggestions"] = sortedMatches.slice(0, 10); // saves top 10 matches - can change if wanted
        setSuggestions(suggestionDict);
        props.saveSuggestions(suggestionDict);
    }

    useEffect(()=> {
        if(suggestions === {} || !suggestions.hasOwnProperty("player") || suggestions["player"] != props.id) {
            console.log("entered loop");
            const matchesArray = [];
            const conciseLeaderboard = mapLeaderboard(props.leaderboard); // array with dictionaries {"rank": x, "name": "abc", "currentTrophiesBest": y, "deck": Array(8)}
            // const match
            if(conciseLeaderboard.length > 0) {
                for(var i = 0; i < conciseLeaderboard.length; i++) {
                    if(conciseLeaderboard[i]["currentTrophiesBest"] !== undefined) { // i.e. if the player has played this season
                        const matchLevel = calculateMatch(conciseLeaderboard[i].deck, props.cards);
                        if(matchLevel > -1000) { // i.e. if player hasn't unlocked card yet, or no player information is present
                            const matchInfo = {};
                            const deckPlayerInfo = {"rank": conciseLeaderboard[i]["rank"], 
                                                    "name": conciseLeaderboard[i]["name"], 
                                                    "currentTrophiesBest": conciseLeaderboard[i]["currentTrophiesBest"]};
                            matchInfo["deckPlayerInfo"] = deckPlayerInfo;
                            matchInfo["match"] = matchLevel;
                            matchInfo["deck"] = conciseLeaderboard[i]["deck"];
                            matchesArray.push(matchInfo);
                        }
                    }
                }
                sortSuggestions(matchesArray);
            }
        }
    }, [props.leaderboard, props.cards, props.saveSuggestions, suggestions]);

    function renderDeck(cardArray) {
        return(
            <div className="deck">
                {cardArray.map(card => {
                    return <img key={card["name"]} className="card" src={card["iconUrl"]} alt={card["name"]}/>;
                })}
            </div>
        )
    }

    if(suggestions.hasOwnProperty("suggestions")) {
        return(
            <section className="suggestions">
                {suggestions["suggestions"].map(info => {
                    return(
                        <article key={info["deckPlayerInfo"]["rank"]}>
                            {renderDeck(info["deck"])}
                            <div className="deckPlayerInfo">
                                <p>{info["deckPlayerInfo"]["name"]}</p>
                                <p>{info["deckPlayerInfo"]["currentTrophiesBest"]}</p>
                            </div>
                            <div className="match">
                                <p>Match (0 is perfect): {info["match"]}</p>
                            </div>
                        </article>
                    )
                })}
            </section>
        );
    } else {
        return(
            <div>
                <p>Cannot generate deck suggestions.</p>
            </div>
        );
    }
}

export default DeckSuggestions;