import React from 'react'
import Key from './Key'

const Keyboard = () => {
  const keyList = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'blank-1', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'blank-2', 'enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del'];

  return (
      <div className='keyboard'>
        {keyList.map((key) => {return <Key keyName={key} key={'key-'+key}/>})}
      </div>
  )
}

export default Keyboard