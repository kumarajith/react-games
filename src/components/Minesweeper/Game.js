import React, {Component} from 'react';
import Tile from './Tile/Tile'
import classes from './Game.module.css';
import {MINE_STATUS, MINE_CLICK} from '../../constants/constants';

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
        tileStatus: null,
        mines: null
    }

    resetBoard () {
        this.setState({tileStatus: null, mines: null, playing: false});
        var tileStatus = new Array(this.props.height);
        var mines = new Array(this.props.height);
        for (var i = 0; i < this.props.height; i++) {
            tileStatus[i] = new Array(this.props.width).fill(MINE_STATUS.CLOSED);
            mines[i] = new Array(this.props.width).fill(0);
        }
        const mineLocations = new Set();
        while (mineLocations.size < this.props.mineCount) {
            mineLocations.add(Math.floor(Math.random() * (this.props.width * this.props.height)));
        }
        for (let location of mineLocations) {
            mines[Math.floor(location/this.props.width)][location%this.props.width] = -1;
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
                    if (currentX < 0 || currentX >= this.props.height || currentY < 0 || currentY >= this.props.width) {
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
        this.setState({tileStatus:tileStatus, mines: mines, playing: true});
    }

    componentWillMount () {
        this.resetBoard();
        this.props.onMount();
    }
    
    componentDidUpdate () {
        if (!this.props.reset) {
            return;
        }
        this.resetBoard();
        this.props.onMount();
        
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
        if (status === MINE_STATUS.CLOSED) {
            if (event.button === MINE_CLICK.LEFT) {
                newStatus = MINE_STATUS.OPEN;
                if (this.state.mines[id.x][id.y] === -1) {
                    this.setState({playing: false});
                } else {
                    var visited = new Array(this.props.height);
                    for (var i = 0; i < visited.length; i++) {
                        visited[i] = new Array(this.props.width).fill(false);
                    }
                    updatedTileStatus = this.updateStatuses(id, updatedTileStatus, visited);
                }
            } else if (event.button === MINE_CLICK.RIGHT) {
                newStatus = MINE_STATUS.FLAGGED;
            }
        } else if (status === MINE_STATUS.FLAGGED) {
            if (event.button === MINE_CLICK.RIGHT) {
                newStatus = MINE_STATUS.CLOSED
            }
        }
        updatedTileStatus[id.x][id.y] = newStatus;
        this.setState({tileStatus: updatedTileStatus});
    }

    updateStatuses = (id, tileStatus, visited) => {
        if (visited[id.x][id.y]) {
            return tileStatus;
        }
        visited[id.x][id.y] = true;
        var currentTile = this.state.mines[id.x][id.y];
        for (let direction of this.directions) {
            if (direction.x === 0 && direction.y === 0) {
                continue;
            }
            let currentX = id.x + direction.x;
            let currentY = id.y + direction.y;
            if (currentX < 0 || currentX >= this.props.height || currentY < 0 || currentY >= this.props.width) {
                continue;
            }
            if (currentTile > 0) {
                if (this.state.mines[currentX][currentY] === 0) {
                    tileStatus[currentX][currentY] = MINE_STATUS.OPEN;
                    tileStatus = this.updateStatuses({x:currentX, y:currentY}, tileStatus, visited)
                }
            } else if (currentTile === 0) {
                if (this.state.mines[currentX][currentY] >= 0) {
                    tileStatus[currentX][currentY] = MINE_STATUS.OPEN;
                    tileStatus = this.updateStatuses({x:currentX, y:currentY}, tileStatus, visited)
                }
            }
        }
        
        return tileStatus;
    }

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