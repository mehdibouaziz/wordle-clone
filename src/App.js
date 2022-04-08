import './App.css';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import Alerts from './components/Alerts';
import Stats from './components/Stats';

import targetWords from './targetWords.json';
import dictionaryJSON from './dictionary.json';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { v4 as uuidv4 } from 'uuid'

function App() {
  const dispatch = useDispatch();

  const wordLength = 5;
  const ALERT_DURATION = 1000;
  const DANCE_ANIMATION_DURATION = 500

  const [isLocked, setIsLocked] = useState(false)
  const [isOverlayOn, setIsOverlayOn] = useState(false)

  const guessCurrent = useSelector((state) => state.board[state.currentLine].map((item) => item[0].toLowerCase()).filter(str => str !== ''))
  const currentChar = useSelector((state) => state.currentChar)
  const currentLine = useSelector((state) => state.currentLine)
  const target = useSelector((state) => state.target)
  const correct = useSelector((state) => state.correct)
  const present = useSelector((state) => state.present)
  const wrong = useSelector((state) => state.wrong)
  const isGameOver = useSelector((state) => state.gameOver)
  const isWin = useSelector((state) => state.win)
  const winLine = useSelector((state) => state.winLine)

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
    if(isLocked){return}
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
    if(isLocked){return}
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

  // called on ENTER
  const submitGuess = () => {
    /* verify and abort if current attempt is not the desired word length */
    const activeTiles = [...document.getElementsByClassName('active')]

    if (guessCurrent.length !== wordLength) {
      displayAlert('Not enough letters')
      shakeTiles(activeTiles)
      return;
    } else if (!dictionary.includes(guessCurrent.join(''))) {
      displayAlert('Not in word list')
      shakeTiles(activeTiles)
      return;
    } else {
      setIsLocked(true)
      dispatch({type:'SUBMIT'});
    }
  };

  // called after each submit by useEffect to update the keyboard colors and unlock the game or trigger the endgame
  const updateKeyboard = () => {
    if (currentLine === 0) {return} // prevent error before first SUBMIT
    let lineToChange = currentLine - 1;
    if(isGameOver) {lineToChange = winLine}

    document.getElementById('tile-'+lineToChange+'4').addEventListener(
      "transitionend", () => {
        correct.forEach((letter) => {
          const keyID = 'key-' + letter
          document.getElementById(keyID).className = "key correct"
        })
    
        present.forEach((letter) => {
          const keyID = 'key-' + letter
          if (!document.getElementById(keyID).classList.contains("correct")) {
            document.getElementById(keyID).className = "key present"
          }
        })
    
        wrong.forEach((letter) => {
          const keyID = 'key-' + letter
          document.getElementById(keyID).className = "key wrong"
        })

        if(!isGameOver) {
          console.log('not over')
          setIsLocked(false)
        } else {
          console.log('over')
          endGame()
        }
        
      }, {once: true})

  }

  // called after last line or early win
  const endGame = () => {
    console.log('you won')
    if (isWin) {
      const danceTiles = [...document.getElementsByClassName('win')]
      let alertTxt = ['Wow! Perfect!','Fantastic!','Bravo!','Well done!','You won!','Phew'][winLine]
      
      setTimeout(() => { //wait for the flip animation to completely finish ~500ms

        displayAlert(alertTxt) //congratulation alert message
        danceTiles.forEach((tile, index) => {
          setTimeout(() => { // Dance animation timeout
            tile.classList.add("dance")
            tile.addEventListener("animationend", () => {
              tile.classList.remove("dance")
              if(index===4){ // display the stats overlay after the last tile finished dancing
                setTimeout(()=>{
                  displayStats()
                },500)
              }
            }, {once: true})
          },(DANCE_ANIMATION_DURATION * index)/2)
        })
      }, 300)

    } else {

    }
    return
  }

  const displayStats = () => {
    setIsOverlayOn(true)
  }
  const hideStats = () => {
    setIsOverlayOn(false)
  }
  const toggleStats = () => {
    setIsOverlayOn(!isOverlayOn)
  }

  // each call creates an alert with a unique ID, then fades it and deletes it
  const displayAlert = (alertText) => {
    const thisAlertID = uuidv4()

    // create alert and dispatch
    dispatch({type:'ALERT-NEW', txt: alertText, id:thisAlertID});

    // fade alert
    setTimeout(() => {
      dispatch({type:'ALERT-FADE',id:thisAlertID});

      setTimeout(() => { //delete alert after fade
        dispatch({type:'ALERT-DEL',id:thisAlertID});
      }, 550); // fade animation is 500, so 550 to leave time for fade
    }, ALERT_DURATION); // duration of alert display is set at the beginning of the component

  }

  const shakeTiles = (activeTiles) => {
    activeTiles.forEach(tile => {
      tile.classList.add("shake")
      tile.addEventListener("animationend", () => {
        tile.classList.remove("shake")
      }, {once: true})
    });
  }

  const deleteKey = () => {
    if (currentChar > 0) { dispatch({type:'DEL'}) }
    return;
  };

  const pressKey = (key) => {
    if (currentChar <= 4) { dispatch({type:'ADD',key:key}) }
    return;
  };

  // eventlisteners
  const startInteraction = () => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleMouseClick);
    return
  }
  const stopInteraction = () => {
    document.removeEventListener('keydown', handleKeyPress);
    document.removeEventListener('click', handleMouseClick);
    return
  }

  useEffect(() => {
    startInteraction()
    return () => {
      stopInteraction()
    }
  });

  useEffect(() => {
    updateKeyboard()
  }, [currentLine,isGameOver])

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
          <button onClick={toggleStats}><i className="fas fa-chart-bar"></i></button>
          <button><i className="fas fa-cog"></i></button>
        </div>
      </nav>

      <div className='game'>
        <Alerts />
        {isOverlayOn ? <Stats hideFn={hideStats}/>:<></>}
        <Board />
        <Keyboard />
      </div>
    </div>
  );
}


export default App;
