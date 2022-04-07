import './App.css';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import Alerts from './components/Alerts';

import targetWords from './targetWords.json';
import dictionaryJSON from './dictionary.json';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { v4 as uuidv4 } from 'uuid'

function App() {
  const dispatch = useDispatch();
  const wordLength = 5;
  const errorDuration = 1000;
  const guessCurrent = useSelector((state) => state.board[state.currentLine].map((item) => item[0].toLowerCase()).filter(str => str !== ''))
  const target = useSelector((state) => state.target)
  const dictionary = JSON.parse(JSON.stringify(dictionaryJSON))

  // select the word of the day from target words lib
  const selectWord = () => {
    const targetWordsLib = JSON.parse(JSON.stringify(targetWords))
    const originDate = new Date(2022,0,1)
    const offsetMs = Date.now() - originDate
    const offsetDays = offsetMs / 1000 / 3600 / 24
    const targetWordIndex = Math.floor(offsetDays)%2315
    const targetWord = targetWordsLib[targetWordIndex].toLowerCase()
    dispatch({type:'TARGET',word:targetWord})
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitGuess();
      return;
    } else if (e.key === "Backspace" || e.key === "Delete") {
      deleteKey();
      return;
    } else if (e.key.match(/^[a-z]$/i)) {
      pressKey(e.key.toLowerCase());
      return;
    } else return;
  };

  const handleMouseClick = (e) => {
    if (e.target.dataset.key === "enter") {
      submitGuess();
      return;
    } else if (e.target.dataset.key === "del") {
      deleteKey();
      return;
    } else if (e.target.matches("[data-key]")) {
      pressKey(e.target.dataset.key.toLowerCase());
      return;
    } else return;
  };

  const submitGuess = () => {
    /* verify and abort if current attempt is not the desired word length */

    if (guessCurrent.length !== wordLength) {
      displayError('LEN')
      shakeTiles()
      return;
    } else if (!dictionary.includes(guessCurrent.join(''))) {
      displayError('LIB')
      shakeTiles()
      return;
    } else {
      dispatch({type:'SUBMIT'});
    }
  };

  // each call creates an alert with a unique ID, then fades it and deletes it
  const displayError = (errorCode) => {
    const thisErrorID = uuidv4()
    let errorTxt = ''

    // create error and dispatch
    switch (errorCode) {
      case 'LEN' :
        console.log('ERROR: GUESS IS NOT OF THE CORRECT LENGTH');
        errorTxt = 'Not enough letters'
        break;
      case 'LIB' :
        console.log('ERROR: GUESS IS NOT A CORRECT WORD')
        errorTxt = 'Not in word list'
        break;
      default :
        return;
    }
    dispatch({type:'ERROR-NEW',txt:errorTxt,id:thisErrorID});

    // fade error
    setTimeout(() => {
      dispatch({type:'ERROR-FADE',id:thisErrorID});

      setTimeout(() => { //delete error after fade
        dispatch({type:'ERROR-DEL',id:thisErrorID});
      }, 550); // fade animation is 500, so 550 to leave time for fade
    }, errorDuration); // duration of error display is set at the beginning of the component

  }

  const shakeTiles = () => {
    const activeTiles = [...document.getElementsByClassName('active')]
    activeTiles.forEach(tile => {
      tile.classList.add("shake")
      tile.addEventListener("animationend", () => {
        tile.classList.remove("shake")
      }, {once: true})
    });
  }

  const deleteKey = () => {
    dispatch({type:'DEL'});
  };

  const pressKey = (key) => {
    dispatch({type:'ADD',key:key});
  };

  // eventlisteners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleMouseClick);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleMouseClick);
    }
  });

  // word of the day selection on first render
  useEffect(() => {
    selectWord()
  }, []);

  return (
    <div className="App">
      <nav>
        <div className='navIcons'>
          <i className="fas fa-bars"></i>
          <i className="fas fa-question-circle"></i>
        </div>
        <h1>Wordle</h1>
        <div className='navIcons'>
          <i className="fas fa-chart-bar"></i>
          <i className="fas fa-cog"></i>
        </div>
      </nav>

      <div className='game'>
        <Alerts />
        <Board />
        <Keyboard />
      </div>
    </div>
  );
}


export default App;
