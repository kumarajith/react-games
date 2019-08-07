import React, {Component} from 'react';
import Tile from './Tile/Tile'
import classes from './Game.module.css';
import {TILE_STATUS, TILE_CLICK} from '../../constants/constants';
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
        firstClick: true,
        mines: null,
        width: null,
        height: null,
        mineCount: null
    }

    resetBoard () {
        var tileStatus = new Array(this.state.height);
        var mines = new Array(this.state.height);
        for (var i = 0; i < this.state.height; i++) {
            tileStatus[i] = new Array(this.state.width).fill(TILE_STATUS.CLOSED);
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
        this.setState({tileStatus:tileStatus, mines: mines, playing: true});
    }
    static getDerivedStateFromProps(props, state) {
        if (props.reset) {
            return {
                tileStatus: null, 
                mines: null, 
                playing: false, 
                width: props.width, 
                height: props.height, 
                mineCount: props.mineCount,
                firstClick: true
            }
        }
        return state;
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
        let updatedMines = this.state.mines.map(function(arr) {
            return arr.slice();
        });
        let status = updatedTileStatus[id.x][id.y];
        let newStatus = status;
        if (status === TILE_STATUS.CLOSED) {
            if (event.button === TILE_CLICK.LEFT) {
                if (this.state.firstClick) {
                    let freeSpaces = (this.props.width * this.props.height) - this.props.mineCount;
                    updatedMines = this.moveInitialMines(updatedMines, id, freeSpaces >= 9);
                }
                newStatus = TILE_STATUS.OPEN;
                if (updatedMines[id.x][id.y] === -1) {
                    this.setState({playing: false});
                    this.props.onGameOver();
                } else {
                    var visited = new Array(this.state.height);
                    for (var i = 0; i < visited.length; i++) {
                        visited[i] = new Array(this.state.width).fill(false);
                    }
                    updatedTileStatus = this.openTiles(id, updatedTileStatus, visited, updatedMines);
                }
            } else if (event.button === TILE_CLICK.RIGHT) {
                newStatus = TILE_STATUS.FLAGGED;
            }
        } else if (status === TILE_STATUS.FLAGGED) {
            if (event.button === TILE_CLICK.RIGHT) {
                newStatus = TILE_STATUS.CLOSED
            }
        }
        updatedTileStatus[id.x][id.y] = newStatus;
        this.setState({tileStatus: updatedTileStatus, mines: updatedMines, firstClick: false});
        if (this.hasWonGame(updatedTileStatus, updatedMines)) {
            this.setState({playing: false});
            this.props.gameWon();
        }
    }
    
    hasWonGame = (tileStatus, mines) => {
        var openCount = 0;
        for (var i = 0; i < tileStatus.length; i++) {
            for (var j = 0; j < tileStatus[i].length; j++) {
                if (mines[i][j] !== -1 && tileStatus[i][j] === TILE_STATUS.OPEN) {
                    openCount++;
                }
            }
        }
        if ((openCount + this.state.mineCount) === (this.state.width * this.state.height)) {
            return true;
        }
        return false;
    }

    openTiles = (id, tileStatus, visited, mines) => {
        if (visited[id.x][id.y]) {
            return tileStatus;
        }
        visited[id.x][id.y] = true;
        var currentTile = mines[id.x][id.y];
        for (let direction of this.directions) {
            let currentX = id.x + direction.x;
            let currentY = id.y + direction.y;
            if (currentX < 0 || currentX >= this.state.height || currentY < 0 || currentY >= this.state.width) {
                continue;
            }
            if (currentTile > 0) {
                if (mines[currentX][currentY] === 0) {
                    tileStatus[currentX][currentY] = TILE_STATUS.OPEN;
                    tileStatus = this.openTiles({x:currentX, y:currentY}, tileStatus, visited, mines)
                }
            } else if (currentTile === 0) {
                if (mines[currentX][currentY] >= 0) {
                    tileStatus[currentX][currentY] = TILE_STATUS.OPEN;
                    tileStatus = this.openTiles({x:currentX, y:currentY}, tileStatus, visited, mines)
                }
            }
        }
        
        return tileStatus;
    }

    moveInitialMines = (mines, id, moveNearby) => {
        if (moveNearby) {
            for (let direction of this.directions) {
                let currentX = id.x + direction.x;
                let currentY = id.y + direction.y;
                if (currentX < 0 || currentX >= this.state.height || currentY < 0 || currentY >= this.state.width) {
                    continue;
                }

                if (mines[currentX][currentY] !== -1) {
                    continue;
                }

                outer:
                for (let i = 0; i < mines.length; i++) {
                    for (let j = 0; j < mines[i].length; j++) {
                        if ((i >= id.x-1 && i <= id.x+1) && (j >= id.y-1 && j <= id.y+1)) {
                            continue;
                        }
                        if (mines[i][j] !== -1) {
                            mines = this.moveMine(mines, {x: currentX, y:currentY}, {x: i, y: j});
                            break outer;
                        }
                    }
                }
            }
        }
        if (mines[id.x][id.y] === -1) {
            for (let i = 0; i < mines.length; i++) {
                for (let j = 0; j < mines[i].length; j++) {
                    if (moveNearby) {
                        if ((i >= id.x-1 && i <= id.x+1) && (j >= id.y-1 && j <= id.y+1)) {
                            continue;
                        }
                    }
                    if (mines[i][j] !== -1) {
                        mines = this.moveMine(mines, id, {x: i, y: j});
                        return mines;
                    }
                }
            }
        }
        return mines;
    }

    moveMine = (mines, from, to) => {
        let fromCount = 0;
        mines[from.x][from.y] = 0;
        mines[to.x][to.y] = -1;
        for (let direction of this.directions) {
            let fromX = from.x + direction.x;
            let fromY = from.y + direction.y;
            if (!(fromX < 0 || fromX >= this.state.height || fromY < 0 || fromY >= this.state.width)) {
                let fromMine = mines[fromX][fromY];
                if (fromMine === -1) {
                    fromCount++;
                } else {
                    mines[fromX][fromY]--;
                }
            }
            let toX = to.x + direction.x;
            let toY = to.y + direction.y;
            if (!(toX < 0 || toX >= this.state.height || toY < 0 || toY >= this.state.width)) {
                let toMine = mines[toX][toY];
                if (toMine !== -1) {
                    mines[toX][toY]++;
                }
            }
        }
        mines[from.x][from.y] = fromCount;
        return mines;
    }

    render () {
        var tiles = null;
        if (this.state.tileStatus !== null) {
            tiles = this.state.tileStatus.map(function(row, index) {
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
        }

        return (
            <div className={classes.Container}>
                {tiles}
            </div>
        );
    }
}

export default Game;