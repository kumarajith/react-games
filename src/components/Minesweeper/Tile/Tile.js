import React from 'react';
import classes from './Tile.module.css';
import {TILE_STATUS} from '../../../constants/constants';

const tile = (props) => {
    let text = '';
    if (props.status === TILE_STATUS.FLAGGED) {
        text = '&#128681;';
    } else if (props.status === TILE_STATUS.OPEN) {
        if (props.text === - 1) {
            text = '&#128163;';
        } else if (props.text > 0) {
            text = props.text;
        }
    }
    return (<div 
        className={props.status === (TILE_STATUS.OPEN) ? classes.TileOpen : classes.TileClosed} 
        onClick={props.clicked}
        onContextMenu={props.clicked}
        dangerouslySetInnerHTML={{ __html: text}}>
    </div>);
}

export default tile;