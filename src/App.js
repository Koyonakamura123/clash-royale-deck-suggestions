import './App.css';
import NamePicker from "./NamePicker";
import PlayerInfo from "./PlayerInfo";
import DeckSuggestions from "./DeckSuggestions";
import {useState, useEffect} from "react";

function App() {

  const [rankings, setRankings] = useState([]);
  const [playerid, setPlayerid] = useState("");
  const [cardLevels, setCardLevels] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  function getRankings() {
    if(rankings.length < 10) {
      fetch("https://cr-leaderboard-api.herokuapp.com/").then(res => res.json()).then(setRankings).catch(console.error);
    }
  }

  useEffect(() => {
    getRankings();
  }, [rankings]);

  return (
    <div className="App">
      <NamePicker saveName = {setPlayerid} />
      <PlayerInfo id={playerid} saveLevels = {setCardLevels} />
      {
        cardLevels && <DeckSuggestions id={playerid} leaderboard = {rankings} cards = {cardLevels} saveSuggestions = {setSuggestions} />
      }
    </div>
  );
}

export default App;
