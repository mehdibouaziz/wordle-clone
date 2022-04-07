import React, {  } from 'react'
import Tile from './Tile';
import { connect } from 'react-redux';


const Board = (props) => {
    const boardTiles = props.board.map((item) => {
        return(
            item.map((subitem) => {
                return <Tile letter={subitem[0]} status={subitem[1]} key={'tile-'+subitem[2]}/>
            })
        );
    });

    return (
        <div className="board-container">
            <div className='board'>
                {boardTiles}
            </div>
            <p>{props.currentChar}</p>
        </div>
    )
}

const mapStateToProps = (state) => ({board: state.board, currentChar:state.currentChar})

export default connect(mapStateToProps)(Board);