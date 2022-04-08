import React from 'react'
import { connect } from 'react-redux';

const Alert = (props) => {
    const alertDivs = Object.keys(props.alert).map((key) => {
        return <div className={props.alert[key].alertClass} key={key}>{props.alert[key].alertTxt}</div>
    })

    return (
        <div className='alert-container'>
            {alertDivs}
        </div>
    )
}

const mapStateToProps = (state) => ({alert: state.alert})

export default connect(mapStateToProps)(Alert)