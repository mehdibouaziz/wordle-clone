import React from 'react'
import texts from '../texts'

import { connect } from 'react-redux';


const Stats = (props) => {
  const language = props.language;

  return (
    <div className='stats-overlay' onClick={() => props.hideFn('stats','hide')}>
      <div className='stats-card'>
        <button className ='overlay-button-close' onClick={() => props.hideFn('stats','hide')}><i className="fas fa-times fa-lg"></i></button>
        <h2>{texts[language].STATS.title}</h2>
        {(props.gameOver && !props.win) ? 
          <>
            <p>{texts[language].GAMEOVER}</p>
            <p className='word'>{props.target}</p>
            </> 
          : <></>}

        {(props.gameOver && props.win) ? 
          <>
            <p>{texts[language].GAMEWON}</p>
            <p className='word'>{props.target}</p>
            </> 
          : <></>}

            <p>{texts[language].NEWPROMP}</p>
            <button onClick={props.newGameFn} className='button-newGame'>{texts[language].NEWGAME}</button>

      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({gameOver: state.gameOver, win: state.win, target: state.target.join('').toUpperCase()})

export default connect(mapStateToProps)(Stats)
