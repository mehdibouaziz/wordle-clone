import { createStore } from "@reduxjs/toolkit";

const boardDefault = [
    [["",0,'00'],["",0,'01'],["",0,'02'],["",0,'03'],["",0,'04']],
    [["",0,'10'],["",0,'11'],["",0,'12'],["",0,'13'],["",0,'14']],
    [["",0,'20'],["",0,'21'],["",0,'22'],["",0,'23'],["",0,'24']],
    [["",0,'30'],["",0,'31'],["",0,'32'],["",0,'33'],["",0,'34']],
    [["",0,'40'],["",0,'41'],["",0,'42'],["",0,'43'],["",0,'44']],
    [["",0,'50'],["",0,'51'],["",0,'52'],["",0,'53'],["",0,'54']]
    ];

/* The second item of each entry tracks the tiles status : 
    0=inactive/default ; 
    1=active ; 
    2=wrong ; 
    3=present ; 
    4=correct */


const initSate = {
    board: boardDefault,
    currentChar: 0,
    currentLine: 0,
    target: [],
    errors: {},
    correct: new Set(),
    present: new Set(),
    wrong: new Set()
}

const reducerFn = (state= initSate, action) => {
    switch(action.type) {
        case 'ADD':  // add a new letter to the board on the current line
            if (state.currentChar <= 4) {
            let newBoard = state.board;
            newBoard[state.currentLine][state.currentChar][0] = action.key;
            newBoard[state.currentLine][state.currentChar][1] = 1;
            return {
                ...state,
                board: [...newBoard],
                currentChar: state.currentChar+1
            };} else return state;

        case 'DEL': // delete the last letter on the current attempt
            if (state.currentChar > 0) {
            let newBoard = state.board;
            newBoard[state.currentLine][state.currentChar-1][0] = '';
            newBoard[state.currentLine][state.currentChar-1][1] = 0;
            return {
                ...state,
                board: [...newBoard],
                currentChar: state.currentChar-1
            }; } else return state;

        case 'TARGET': // set the target word
            return {
            ...state,
            target: action.word.split('')
            };

        case 'SUBMIT': // submit the current guess to check vs target
            {const guessCurrent = state.board[state.currentLine].map((item) => item[0].toLowerCase()).filter(str => str !== '');
            let newBoard = state.board;
            let newCorrect = new Set([...state.correct]);
            let newPresent = new Set([...state.present]);
            let newWrong = new Set([...state.wrong]);
            
            guessCurrent.forEach((val, index) => { // verify each character of the guess vs the target
                if (val === state.target[index]) { // check if correct match
                    newBoard[state.currentLine][index][1] = 4;
                    newCorrect.add(val);
                } else if (state.target.some(str => str === val)) { // check if present
                    newBoard[state.currentLine][index][1] = 3;
                    newPresent.add(val);
                } else { // else wrong
                    newBoard[state.currentLine][index][1] = 2;
                    newWrong.add(val);
                }
            })

            return {
                ...state,
                board: [...newBoard],
                currentChar: 0,
                currentLine: state.currentLine+1,
                correct: new Set([...newCorrect]),
                present: new Set([...newPresent]),
                wrong: new Set([...newWrong])
            }}

        case 'ERROR-NEW': // add a new unique error to the store
            {const newErrors = {...state.errors};
            newErrors[action.id] = {alertTxt : action.txt, alertClass: 'alert'};
            return {
                ...state,
                errors : {...newErrors}
            };}

        case 'ERROR-FADE': {
            const newErrors = {...state.errors}
            newErrors[action.id].alertClass = 'alert hide'
            return {
                ...state,
                errors : {...newErrors}
            };}

        case 'ERROR-DEL': {
            const newErrors = {...state.errors}
            delete newErrors[action.id]
            return {
                ...state,
                errors : {...newErrors}
            };}
    

        default:
            return state;
    }
};

const store = createStore(reducerFn,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

export default store;