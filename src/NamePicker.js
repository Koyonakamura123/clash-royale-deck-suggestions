import './App.css';
import {useState, useEffect} from "react";

function NamePicker(props) {
    const [username, setUsername] = useState('')
    function save(){
        props.saveName(username)
    }
    return (
        <div className = "name-picker">
            #
            <input value={username}
                onChange={e=> setUsername(e.target.value)}
            />
            <button onClick={save}>Search</button>
        </div>
    )
}

export default NamePicker