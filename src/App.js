import './App.css';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import Alert from './components/Alert';

import targetWords from './targetWords.json';
import dictionaryJSON from './dictionary.json';


import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';



function App() {
  const dispatch = useDispatch();
  const wordLength = 5;
  const guessCurrent = useSelector((state) => state.board[state.currentLine].map((item) => item[0].toLowerCase()).filter(str => str !== ''))
  const target = useSelector((state) => state.target)
  const dictionary = JSON.parse(JSON.stringify(dictionaryJSON))

  const selectWord = () => {
    const targetWordsLib = JSON.parse(JSON.stringify(targetWords))
    const originDate = new Date(2022,0,1)
    const offsetMs = Date.now() - originDate
    const offsetDays = offsetMs / 1000 / 3600 / 24
    const targetWordIndex = Math.floor(offsetDays)%2315
    const targetWord = targetWordsLib[targetWordIndex]
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
      pressKey(e.key);
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
      pressKey(e.target.dataset.key);
      return;
    } else return;
  };

  const submitGuess = () => {
    /* verify and abort if current attempt is not the desired word length */
    console.log(guessCurrent)
    console.log(target)

    if (guessCurrent.length !== wordLength) {
      console.log('ERROR: GUESS IS NOT OF THE CORRECT LENGTH')
      return;
    } else if (!dictionary.includes(guessCurrent.join(''))) {
      console.log('ERROR: GUESS IS NOT A CORRECT WORD')
      return;
    } else {
      dispatch({type:'SUBMIT'});
    }
  };

  const deleteKey = () => {
    dispatch({type:'DEL'});
  };

  const pressKey = (key) => {
    dispatch({type:'ADD',key:key});
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('click', handleMouseClick);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleMouseClick);
    }
  });

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
        <Alert errorCode='LEN'/>
        <Board />
        <Keyboard />
      </div>
    </div>
  );
}


export default App;
