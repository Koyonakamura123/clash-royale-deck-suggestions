import './App.css';
import NamePicker from "./NamePicker";
import PlayerInfo from "./PlayerInfo";
import {useState, useEffect} from "react";

function App() {

  const [rankings, setRankings] = useState([]);
  const [playerid, setPlayerid] = useState("");
  const [cardLevels, setCardLevels] = useState([]);

  function getRankings() {
    fetch("https://cr-leaderboard-api.herokuapp.com/").then(res => res.json()).then(setRankings).catch(console.error);
  }

  useEffect(() => {
    getRankings();
    // console.log(JSON.stringify(rankings, undefined, 2));
    // console.log("length: " + rankings.length);
  }, []);

  return (
    <div className="App">
      <NamePicker saveName = {setPlayerid} />
      <PlayerInfo id={playerid} saveLevels = {setCardLevels} />
      {/* <DeckSuggestions leaderboard = {rankings} cards = {cardLevels} /> */}
    </div>
  );
}

export default App;
