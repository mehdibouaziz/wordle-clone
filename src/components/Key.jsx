import React from 'react'
import { connect } from 'react-redux';


const Key = (props) => {
    if (/^blank-/i.test(props.keyName)) {
        return <div className="blank"></div>
    } else if (/^enter/i.test(props.keyName)) {
        return <button className="key big" id={'key-enter'} data-key={props.keyName}>{props.language==='ENG' ? 'ENTER' : 'ENTREE'}</button>
    } else if (/^del/i.test(props.keyName)) {
        return <button className="key big" id={'key-del'} data-key={props.keyName}><i className="fas fa-backspace"></i></button>
    } else {
        return <button className='key' id ={'key-'+props.keyName} data-key={props.keyName}>{props.keyName.toUpperCase()}</button>
    }
}

const mapStateToProps = (state) => ({
    target: state.target,
    correct: Array.from(state.correct),
    present: Array.from(state.present),
    wrong: Array.from(state.wrong)
})

export default connect(mapStateToProps)(Key);