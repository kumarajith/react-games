import React, {Component} from 'react';
import Tile from '../../components/minesweeper/Tile';
import classes from './Game.module.css';
import * as constants from '../../constants/constants';

class Game extends Component {
    
    directions = [
        {x:-1,y:-1},
        {x:-1,y:0},
        {x:-1,y:1},
        {x:0,y:-1},
        {x:0,y:1},
        {x:1,y:-1},
        {x:1,y:0},
        {x:1,y:1}
    ]

    state = {
        playing: true,
        width: 7,
        height: 7,
        mineCount: 2,
        tileStatus: null,
        mines: null
    }

    componentWillMount () {
        console.log("called");
        var tileStatus = new Array(this.state.height);
        var mines = new Array(this.state.height);
        for (var i = 0; i < tileStatus.length; i++) {
            tileStatus[i] = new Array(this.state.width).fill(constants.STATUS.CLOSED);
            mines[i] = new Array(this.state.width).fill(0);
        }

        const mineLocations = new Set();
        while (mineLocations.size < this.state.mineCount) {
            mineLocations.add(Math.floor(Math.random() * (this.state.width * this.state.height)));
        }
        for (let location of mineLocations) {
            mines[Math.floor(location/this.state.width)][location%this.state.width] = -1;
        }
        for (i = 0; i < mines.length; i++) {
            for (var j = 0; j < mines[i].length ; j++) {
                if (mines[i][j] === -1) {
                    continue;
                }
                let currentCount = 0;
                for (let direction of this.directions) {
                    let currentX = i + direction.x;
                    let currentY = j + direction.y;
                    if (currentX < 0 || currentX >= this.state.height || currentY < 0 || currentY >= this.state.width) {
                        continue;
                    }
                    if (mines[currentX][currentY] === -1) {
                        currentCount++;
                    }
                }
                mines[i][j] = currentCount;
            }
        }
        console.log(mines);
        this.setState({tileStatus:tileStatus, mines: mines});
    }
    
    tileClickedHandler = (event, id) => {
        event.preventDefault();
        if (!this.state.playing) {
            return;
        }
        let updatedTileStatus = this.state.tileStatus.map(function(arr) {
            return arr.slice();
        });
        let status = updatedTileStatus[id.x][id.y];
        let newStatus = status;
        if (status === constants.STATUS.CLOSED) {
            if (event.button === constants.CLICK.LEFT) {
                newStatus = constants.STATUS.OPEN;
                if (this.state.mines[id.x][id.y] !== -1) {
                    this.state.playing = false;
                    // var visited = new Array(this.state.height);
                    // for (var i = 0; i < visited.length; i++) {
                    //     visited[i] = new Array(this.state.width).fill(false);
                    // }
                    // updatedTileStatus = this.updateStatuses(id, updatedTileStatus, visited);
                }
            } else if (event.button === constants.CLICK.RIGHT) {
                newStatus = constants.STATUS.FLAGGED;
            }
        } else if (status === constants.STATUS.FLAGGED) {
            if (event.button === constants.CLICK.RIGHT) {
                newStatus = constants.STATUS.CLOSED
            }
        }
        updatedTileStatus[id.x][id.y] = newStatus;
        this.setState({tileStatus: updatedTileStatus});
    }

    // updateStatuses = (id, tileStatus, visited) => {
    //     if (visited[id.x][id.y]) {
    //         return tileStatus;
    //     }
    //     console.log(id);
    //     visited[id.x][id.y] = true;
    //     for (let direction of this.directions) {
    //         if (direction.x === 0 && direction.y === 0) {
    //             continue;
    //         }
    //         let currentX = id.x + direction.x;
    //         let currentY = id.y + direction.y;
    //         if (currentX < 0 || currentX >= this.state.height || currentY < 0 || currentY >= this.state.width) {
    //             continue;
    //         }
    //         console.log(currentX + " - " + currentY);
    //         if (this.state.mines[currentX][currentY] === 0) {
    //             console.log(tileStatus);
    //             tileStatus[currentX][currentY] = constants.STATUS.OPEN;
    //             tileStatus = this.updateStatuses({x:currentX, y:currentY}, tileStatus, visited)
    //         }
    //     }
        
    //     return tileStatus;
    // }

    render () {
        var tiles = this.state.tileStatus.map(function(row, index) {
            let rowTiles = row.map(function(tile, innerIndex) {
                return <Tile 
                key = {index + "_" + innerIndex}
                clicked={(event) => this.tileClickedHandler(event, {x:index,y:innerIndex})} 
                text={this.state.mines[index][innerIndex]}
                status={tile}/>;
            }, this);
            return <div 
                key = {index}
                className={classes.GameRow}>{rowTiles}</div>;
        }, this);
        // var tiles = <Tile 
        //     clicked={(event) => this.tileClickedHandler(event, {x:0,y:index})} 
        //     text='&#128681;'
        //     status={this.state.tileStatus[0][0]}/>;

        return (
            <div>
                {tiles}
            </div>
        );
    }
}

export default Game;