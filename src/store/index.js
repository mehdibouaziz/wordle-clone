import { createStore } from "@reduxjs/toolkit";

const boardDefault = [
    [["",'00'],["",'01'],["",'02'],["",'03'],["",'04']],
    [["",'10'],["",'11'],["",'12'],["",'13'],["",'14']],
    [["",'20'],["",'21'],["",'22'],["",'23'],["",'24']],
    [["",'30'],["",'31'],["",'32'],["",'33'],["",'34']],
    [["",'40'],["",'41'],["",'42'],["",'43'],["",'44']],
    [["",'50'],["",'51'],["",'52'],["",'53'],["",'54']]
    ];

/* The second item of each entry tracks the tiles status : 
    0=inactive/default ; 
    1=active ; 
    2=wrong ; 
    3=present ; 
    4=correct */

const FLIP_ANIMATION_DURATION = 500;

const initState = {
    board: [...boardDefault],
    currentChar: 0,
    currentLine: 0,
    target: [],
    alert: {},
    correct: [],
    present: [],
    wrong: [],
    gameOver: false,
    win: false,
    winLine: 0
}

const reducerFn = (state= initState, action) => {
    switch(action.type) {
        case 'ADD': { // add a new letter to the board on the current line
            let newBoard = state.board;
            const tileID = 'tile-'+state.currentLine+state.currentChar
            const currentTile = document.getElementById(tileID)
            currentTile.classList.add("active")
            newBoard[state.currentLine][state.currentChar][0] = action.key;
            return {
                ...state,
                board: [...newBoard],
                currentChar: state.currentChar+1
            }}

        case 'DEL': {// delete the last letter on the current attempt
            const tileID = 'tile-'+state.currentLine+(state.currentChar-1)
            const currentTile = document.getElementById(tileID)
            currentTile.classList.remove("active")
            let newBoard = state.board;
            newBoard[state.currentLine][state.currentChar-1][0] = '';
            return {
                ...state,
                board: [...newBoard],
                currentChar: state.currentChar-1
            }}

        case 'TARGET': {// set the target word
            return {
            ...state,
            target: action.word.split('')
            };}

        case 'SUBMIT': // submit the current guess to check vs target
            {const guessCurrent = state.board[state.currentLine].map((item) => item[0].toLowerCase()).filter(str => str !== '');
            let newCorrect = [...state.correct];
            let newPresent = [...state.present];
            let newWrong = [...state.wrong];
            let newCurrentLine = state.currentLine;
            let newGameOver = false;
            let newWin = ( guessCurrent.join('') === state.target.join('') );
            let newWinLine = state.winLine;

            if (newWin) {newGameOver = true; newWinLine = state.currentLine}
            if (state.currentLine < 5) {newCurrentLine = state.currentLine + 1}
            if (state.currentLine === 5 && !newWin) {newGameOver = true}
            
            guessCurrent.forEach((char, index) => { // verify each character of the guess vs the target
                if (char === state.target[index]) { // check if correct match
                    if (!newCorrect.includes(char)) {newCorrect.push(char);}
                } else if (state.target.some(str => str === char)) { // check if present
                    if (!newPresent.includes(char)) {newPresent.push(char);}
                } else { // else wrong
                    if (!newWrong.includes(char)) {newWrong.push(char);}
                }

                const tileID = 'tile-'+state.currentLine+index
                const currentTile = document.getElementById(tileID)

                if (newWin) {currentTile.classList.add("win")} // tag the tiles for the dance animation

                setTimeout(() => {
                    currentTile.classList.add("flip")
                }, (FLIP_ANIMATION_DURATION * index) / 2)

                currentTile.addEventListener("transitionend", () => {
                    currentTile.classList.remove("flip");
                    currentTile.classList.remove("active");

                    if (char === state.target[index]) { // check if correct match
                        currentTile.classList.add("correct");
                    } else if (state.target.some(str => str === char)) { // check if present
                        currentTile.classList.add("present");
                    } else { // else wrong
                        currentTile.classList.add("wrong");
                    }
                }, {once:true})
            })


            return {
                ...state,
                currentChar: 0,
                currentLine: newCurrentLine,
                correct: [...newCorrect],
                present: [...newPresent],
                wrong: [...newWrong],
                gameOver: newGameOver,
                win: newWin,
                winLine: newWinLine
            }}

        case 'RESET': { // return the game to initial state, but keep the target
            const emptyboard = [
                [["",'00'],["",'01'],["",'02'],["",'03'],["",'04']],
                [["",'10'],["",'11'],["",'12'],["",'13'],["",'14']],
                [["",'20'],["",'21'],["",'22'],["",'23'],["",'24']],
                [["",'30'],["",'31'],["",'32'],["",'33'],["",'34']],
                [["",'40'],["",'41'],["",'42'],["",'43'],["",'44']],
                [["",'50'],["",'51'],["",'52'],["",'53'],["",'54']]
                ];

            return {
                ...state,
                board: [...emptyboard],
                currentChar: 0,
                currentLine: 0,
                correct: [],
                present: [],
                wrong: [],
                gameOver: false,
                win: false,
                winLine: 0
            }
        }

        case 'ALERT-NEW': // add a new unique alert to the store
            {const newAlert = {...state.alert};
            newAlert[action.id] = {alertTxt : action.txt, alertClass: 'alert'};
            return {
                ...state,
                alert : {...newAlert}
            };}

        case 'ALERT-FADE': {
            const newAlert = {...state.alert}
            newAlert[action.id].alertClass = 'alert hide'
            return {
                ...state,
                alert : {...newAlert}
            };}

        case 'ALERT-DEL': {
            const newAlert = {...state.alert}
            delete newAlert[action.id]
            return {
                ...state,
                alert : {...newAlert}
            };}
    

        default:
            return state;
    }
};

const store = createStore(reducerFn,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

export default store;