import React, {  } from 'react'
import Tile from './Tile';
import { connect } from 'react-redux';


const Board = (props) => {
    const boardTiles = props.board.map((item) => {
        return(
            item.map((subitem) => {
                return <Tile letter={subitem[0]} status={0} id={'tile-'+subitem[1]} key={'tile-'+subitem[1]}/>
            })
        );
    });

    return (
        <div className="board-container">
            <div className='board'>
                {boardTiles}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({board: state.board, currentChar:state.currentChar})

export default connect(mapStateToProps)(Board);