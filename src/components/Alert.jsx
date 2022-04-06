import React from 'react'

const Alert = (props) => {
    let alertText = ''
    switch (props.errorCode) {
        case 'LEN':
            alertText = 'Not enough letters';
            break;
        case 'DIC':
            alertText = 'Not in word list';
            break;
        default :
            break;
    }
    return (
        <div className='alert-container'>
            <div className='alert'>
                {alertText}
            </div>
        </div>
    )
}

export default Alert