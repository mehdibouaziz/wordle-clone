import { createStore } from "@reduxjs/toolkit";

const boardDefault = [
    [["",0],["",0],["",0],["",0],["",0]],
    [["",0],["",0],["",0],["",0],["",0]],
    [["",0],["",0],["",0],["",0],["",0]],
    [["",0],["",0],["",0],["",0],["",0]],
    [["",0],["",0],["",0],["",0],["",0]],
    [["",0],["",0],["",0],["",0],["",0]]
    ];

/* The second item of each entry tracks the tiles status : 
    0=inactive/default ; 
    1=active ; 
    2=wrong ; 
    3=wrong-location ; 
    4=correct */


const initSate = {
    board: boardDefault,
    currentChar: 0,
    currentLine: 0,
    target: []
}

const reducerFn = (state= initSate, action) => {
    switch(action.type) {
        case 'ADD':
            if (state.currentChar <= 4) {
            let newBoard = state.board;
            newBoard[state.currentLine][state.currentChar][0] = action.key;
            newBoard[state.currentLine][state.currentChar][1] = 1;
            return {
                ...state,
                board: [...newBoard],
                currentChar: state.currentChar+1
            };} else return state;

        case 'DEL':
            if (state.currentChar > 0) {
            let newBoard = state.board;
            newBoard[state.currentLine][state.currentChar-1][0] = '';
            newBoard[state.currentLine][state.currentChar-1][1] = 0;
            return {
                ...state,
                board: [...newBoard],
                currentChar: state.currentChar-1
            }; } else return state;

        case 'TARGET':
            return {
            ...state,
            target: action.word.split('')
            };

        case 'SUBMIT':
            const guessCurrent = state.board[state.currentLine].map((item) => item[0].toLowerCase()).filter(str => str !== '');
            const newBoard = state.board;
            
            guessCurrent.forEach((val, index) => { /* verify each character of the guess vs the target */
                if (val === state.target[index]) { /* check if correct match */
                    newBoard[state.currentLine][index][1] = 4;
                } else if (state.target.some(str => str === val)) { /* check if val matches any of the target letters */
                    newBoard[state.currentLine][index][1] = 3;
                } else {
                    newBoard[state.currentLine][index][1] = 2;
                }
            })
            return {
                ...state,
                board: [...newBoard],
                currentChar: 0,
                currentLine: state.currentLine+1
            }
            

        default:
            return state;
    }
};

const store = createStore(reducerFn,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );

export default store;