import React from 'react'

const Tile = (props) => {
  let classStrg = ''
  switch(props.status) {
    case 0:
      classStrg = 'tile inactive';
      break;
    case 1:
      classStrg = 'tile active';
      break;
    case 2:
      classStrg = 'tile wrong';
      break;
    case 3:
      classStrg = 'tile wrong-location';
      break;
    case 4:
      classStrg = 'tile correct';
      break;
    default:
      classStrg = 'tile inactive';
      break;
      
  }
  return (
    <div className={classStrg} title={props.letter}>{props.letter}</div>
  )
}

export default Tile