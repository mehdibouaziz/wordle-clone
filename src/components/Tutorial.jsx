import React from 'react'
import texts from '../texts'

const Tutorial = (props) => {
    let LANG = props.language

  return (
    <div className='tuto-overlay'>
      <div className='tuto-card'>

        <div className='tuto-title-line'>
            <h2>{texts[LANG].TUTO.title}</h2>
            <button className ='overlay-button-close' onClick={() => props.hideFn('tuto','hide')}><i className="fas fa-times fa-lg"></i></button>
        </div>
        <div className='tuto-section'>
            <p>{texts[LANG].TUTO.p1}<b>{texts[LANG].TUTO.b1}</b>{texts[LANG].TUTO.p2}</p>
            <p>{texts[LANG].TUTO.p3}</p>
            <p>{texts[LANG].TUTO.p4}</p>
        </div>
        <div className='tuto-examples'>
            <p><b>{texts[LANG].TUTO.b2}</b></p>
            <div className='tuto-examples-tilerow'>
                <div className='tile correct'>H</div>
                <div className='tile'>E</div>
                <div className='tile'>L</div>
                <div className='tile'>L</div>
                <div className='tile'>O</div>
            </div>
            <p>{texts[LANG].TUTO.p5}<b style={{color: 'rgb(83, 141, 78)'}}>H</b>{texts[LANG].TUTO.p6}</p>
            <div className='tuto-examples-tilerow'>
                <div className='tile'>W</div>
                <div className='tile present'>O</div>
                <div className='tile'>R</div>
                <div className='tile'>L</div>
                <div className='tile'>D</div>
            </div>
            <p>{texts[LANG].TUTO.p5}<b style={{color: 'rgb(181, 159, 59)'}}>O</b>{texts[LANG].TUTO.p7}</p>
            <div className='tuto-examples-tilerow'>
                <div className='tile'>H</div>
                <div className='tile'>O</div>
                <div className='tile'>W</div>
                <div className='tile wrong'>R</div>
                <div className='tile'>U</div>
            </div>
            <p>{texts[LANG].TUTO.p5}<b style={{color: 'rgb(120,120,120)'}}>R</b>{texts[LANG].TUTO.p8}</p>
        </div>
        <div className='tuto-section'>
            <p><b>Planned features:</b></p>
            <p>- Light/Dark theme switch</p>
            <p>- Persisting stats with local storage</p>
        </div>
        <div className='tuto-section'>
            <p><b>Credits:</b></p>
            <p>- Language icons: <a href="https://www.flaticon.com/free-icons/france" title="france icons">France icons created by Freepik - Flaticon</a></p>
            
        </div>

      </div>
    </div>
  )
}

export default Tutorial