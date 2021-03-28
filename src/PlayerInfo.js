import './App.css';
import {useState, useEffect} from "react";

function getCardLevels(playerInfo) {
    const cardDict = [];
    console.log(playerInfo["cards"]);
    var i;
    for(i=0; i < playerInfo["cards"].length; i++) {
        var currentCard = playerInfo["cards"][i];
        cardDict[currentCard["name"]] = currentCard["level"];
    }
    console.log(cardDict);
    return cardDict;
}

function PlayerInfo(props) {
    const [playerInfo, setPlayerInfo] = useState(undefined);
    function getPlayerInfo(tag) {
        if(playerInfo === undefined || !playerInfo.hasOwnProperty("tag") || playerInfo["tag"] !== ("#" + tag)) {
            fetch("https://cr-leaderboard-api.herokuapp.com/playerInfo?id=" + tag).then(response => response.json()).then(data => setPlayerInfo(data)).catch(error => console.error("Error: ", error)); //%25 encodes to %
        } 
    }
    useEffect(() => {
        if(props.id.length > 6) { // initial check to see if entered id is of appropriate length - arbitrary for now
            getPlayerInfo(props.id);
            if(playerInfo !== undefined && playerInfo.hasOwnProperty("tag")) {
                props.saveLevels(getCardLevels(playerInfo));
            }
        }
    }, [props.id, playerInfo]);
    
    if(playerInfo !== undefined && playerInfo.hasOwnProperty("tag")) {
        return(
            <div>
                <p>Name: {playerInfo["name"]}</p>
                <p>Player Level: {playerInfo["expLevel"]}</p>
            </div>
        )
    }
    return(
        <div>
            <p>Player not found</p>
        </div>
    )
}

export default PlayerInfo