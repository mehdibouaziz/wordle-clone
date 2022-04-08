import React from 'react'

const Stats = (props) => {
  return (
    <div className='stats-container'>
        <button onClick={props.hideFn}>X</button>
    </div>
  )
}

export default Stats