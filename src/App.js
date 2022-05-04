import './App.css';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import Alerts from './components/Alerts';
import Stats from './components/Stats';
import Tutorial from './components/Tutorial';

import targetWords from './targetWords.json';
import dictionaryJSON from './dictionary.json';
import frenchWords from './dictionaryFr.json'
import texts from './texts';

import UK from './images/united-kingdom.png'
import FR from './images/france.png'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { v4 as uuidv4 } from 'uuid'

function App() {
  const dispatch = useDispatch();

  const wordLength = 5;
  const ALERT_DURATION = 1000;
  const DANCE_ANIMATION_DURATION = 500

  const [isLocked, setIsLocked] = useState(false)
  const [isStatsOn, setIsStatsOn] = useState(false)
  const [isTutoOn, setIsTutoOn] = useState(false)
  const [language, setLanguage] = useState('ENG')

  const guessCurrent = useSelector((state) => state.board[state.currentLine].map((item) => item[0].toLowerCase()).filter(str => str !== ''))
  const currentChar = useSelector((state) => state.currentChar)
  const currentLine = useSelector((state) => state.currentLine)
  const correct = useSelector((state) => state.correct)
  const present = useSelector((state) => state.present)
  const wrong = useSelector((state) => state.wrong)
  const isGameOver = useSelector((state) => state.gameOver)
  const isWin = useSelector((state) => state.win)
  const winLine = useSelector((state) => state.winLine)

  const ENdictionary = JSON.parse(JSON.stringify(dictionaryJSON))
  const FRdictionary = JSON.parse(JSON.stringify(frenchWords))
  const ENwordles = JSON.parse(JSON.stringify(targetWords))

  // select the word of the day from target words lib
  const selectWord = (mode='daily') => {
    let targetWordsLib = []
    if (language === 'ENG') {
      targetWordsLib = ENwordles
    } else {
      targetWordsLib = FRdictionary
    }

    let targetWordIndex = 0
    if (mode === 'daily') {
      const originDate = new Date(2022,0,1)
      const offsetMs = Date.now() - originDate
      const offsetDays = offsetMs / 1000 / 3600 / 24
      targetWordIndex = Math.floor(offsetDays)%targetWordsLib.length
    } else if (mode === 'random') {
      targetWordIndex = Math.floor(Math.random() * targetWordsLib.length)
    }

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
    document.activeElement.blur()
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
      displayAlert(texts[language].ALERTS.length)
      shakeTiles(activeTiles)
      return;
    } else if (
      (language === 'ENG' && !ENdictionary.includes(guessCurrent.join('')))
      || (language === 'FRE' && !FRdictionary.includes(guessCurrent.join('').toUpperCase()))
      ) {
      displayAlert(texts[language].ALERTS.list)
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
          setIsLocked(false)
        } else {
          endGame()
        }
        
      }, {once: true})

  }

  // called after last line or early win
  const endGame = () => {
    if (isWin) {
      const danceTiles = [...document.getElementsByClassName('win')]
      let alertTxt = [...texts[language].ALERTS.win][winLine]
      
      setTimeout(() => { //wait for the flip animation to completely finish ~500ms

        displayAlert(alertTxt) //congratulation alert message
        danceTiles.forEach((tile, index) => {
          setTimeout(() => { // Dance animation timeout
            tile.classList.add("dance")
            tile.addEventListener("animationend", () => {
              tile.classList.remove("dance")
              if(index===4){ // display the stats overlay after the last tile finished dancing
                setTimeout(()=>{
                  overlaysControl('stats','show')
                },500)
              }
            }, {once: true})
          },(DANCE_ANIMATION_DURATION * index)/2)
        })
      }, 300)

    } else {
      overlaysControl('stats','show')
    }
    return
  }

  // reset the game
  const resetGame = () => {
    dispatch({type:'RESET'});
    [...document.getElementsByClassName("tile")].forEach(element => element.className= "tile");
    [...document.getElementsByClassName("key")].forEach(element => {
      if (element.dataset.key === 'enter' || element.dataset.key === 'del') {element.className= "key big"}
      else {element.className= "key"}
    })
    setIsLocked(false);
    return;
  }

  // generate a new game with a random world
  const newRandGame = () => {
    if (window.confirm(texts[language].RANDOM)) {
      resetGame();
      selectWord('random')
      return;
    } else {
      return;
    }
  }

  // controls for stats and tutorial display (toggle, hide, show)
  function overlaysControl(which, what) {
    if (which === 'stats') {
      switch (what) {
        case 'toggle':
          setIsStatsOn(!isStatsOn);
          break;
        case 'hide':
          setIsStatsOn(false);
          break;
        case 'show':
          setIsStatsOn(true);
          break;
        default:
          break;
      }
    }
    if (which === 'tuto') {
      switch (what) {
        case 'toggle':
          setIsTutoOn(!isTutoOn);
          break;
        case 'hide':
          setIsTutoOn(false);
          break;
        case 'show':
          setIsTutoOn(true);
          break;
        default:
          break;
      }
    }
  }

  // toggle language and reset the game
  const languageToggle = () => {
    if (window.confirm(texts[language].TOGGLE)) {
      // clear the board then change language
      if (language === 'ENG') {
        setLanguage('FRE')
      } else {
        setLanguage('ENG')
      }
      resetGame();
      return;
    } else {
      return;
    }
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
  }, [language]);

  // trigger endgame on gameover
    useEffect(() => {
      if(isGameOver && !isWin) {
        setTimeout(() => {
          endGame();
        }, 500)
      } else return;
    }, [isGameOver]);

  return (
    <div className="App">
      <nav>
        <div className='nav-icons'>
          {/* <i className="fas fa-bars"></i> */}
          <button onClick={() => overlaysControl('tuto','show')}><i className="fas fa-question-circle"></i></button>
        </div>
        <h1>Wordle</h1>
        <div className='nav-icons'>
          <button onClick={() => overlaysControl('stats','show')}><i className="fas fa-chart-bar"></i></button>
          <button onClick={languageToggle}><img src={language === 'ENG' ? UK : FR} className='nav-language-icon'></img></button>
          {/* <button><i className="fas fa-cog"></i></button> */}
        </div>
      </nav>

      {isStatsOn ? <Stats hideFn={overlaysControl} newGameFn={newRandGame} language={language}/>:<></>}
      {isTutoOn ? <Tutorial hideFn={overlaysControl} language={language}/>:<></>}

      <div className='game'>
        <Alerts />
        <Board />
        <Keyboard language={language}/>
      </div>

     
    </div>
  );
}


export default App;
