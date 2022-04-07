import React from 'react'
import { connect } from 'react-redux';

const Alert = (props) => {
    const alertDivs = Object.keys(props.errors).map((key) => {
        return <div className={props.errors[key].alertClass} key={key}>{props.errors[key].alertTxt}</div>
    })

    return (
        <div className='alert-container'>
            {alertDivs}
        </div>
    )
}

const mapStateToProps = (state) => ({errors: state.errors})

export default connect(mapStateToProps)(Alert)