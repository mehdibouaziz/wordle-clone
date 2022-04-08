import React from 'react'

const Tile = (props) => {

  return (
    <div className='tile' title={props.letter} id={props.id}>{props.letter}</div>
  )
}

export default Tile