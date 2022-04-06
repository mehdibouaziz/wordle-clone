import React from 'react'
import Key from './Key'

const Keyboard = () => {
  const keyList = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "blank", "A", "S", "D", "F", "G", "H", "J", "K", "L", "blank", "enter", "Z", "X", "C", "V", "B", "N", "M", "del"];

  return (
      <div className='keyboard'>
        {keyList.map((key) => {return <Key keyName={key} />})}
      </div>
  )
}

export default Keyboard