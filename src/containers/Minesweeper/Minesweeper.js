import React, {Component} from 'react';
import Game from '../../components/Minesweeper/Game';
import SliderControls from '../../components/UI/SliderControls/SliderControls';
import classes from './Minesweeper.module.css';
import Modal from 'react-modal';
import {GAME_STATUS} from '../../constants/constants';
Modal.setAppElement('#root');

class Minesweeper extends Component {
    state = {
        min: 2,
        max: 100,
        maxMines: 99,
        height: 5,
        width: 5,
        mines: 10,
        reset: true,
        modalIsOpen: true,
        gameState: GAME_STATUS.IN_PROGRESS
    }

    customStyles = {
        content : {
            top                   : '50%',
            left                  : '50%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(-50%, -50%)'
        }
    };

    componentDidMount() {
        console.log("did mount");
        this.setState({maxMines: (this.state.height * this.state.width) - 1})
    }

    onSliderChangeHandler = (event, type) => {
        if (type === 'mines') {
            var max = Math.min(event.target.value, this.state.maxMines);
            this.setState({mines: max});
        } else {
            var maxMines = (event.target.value * (type === 'height' ? this.state.width : this.state.height)) - 1;
            var mines = Math.min(this.state.mines, maxMines);
            this.setState({[type]: parseInt(event.target.value, 10), maxMines: maxMines, mines: mines});
        }
    }

    resetHandler = (status) => {
        this.setState({reset: status});
        if (status) {
            this.setState({gameState: GAME_STATUS.IN_PROGRESS});
        }
    }

    openModal = () => {
        this.setState({modalIsOpen: true});
    }
     
    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    gameOverHandler = () => {
        this.setState({gameState: GAME_STATUS.LOST, modalIsOpen: true});
    }

    gameWonHandler = () => {
        this.setState({gameState: GAME_STATUS.WON, modalIsOpen: true});
    }

    render () {
        var text = this.state.gameState;
        text = text === GAME_STATUS.IN_PROGRESS ? "Welcome to minesweeper" : text;
        return (
            <div className={classes.Container}>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Modal"
                    style={this.customStyles}>
                    {text}
                </Modal>
                <div className={classes.Controls}>
                    <h1>Minesweeper</h1>
                    <SliderControls
                        min={this.state.min}
                        max={this.state.max}
                        height={this.state.height}
                        width={this.state.width}
                        mines={this.state.mines}
                        maxMines={this.state.maxMines}
                        onSliderChangeHandler={this.onSliderChangeHandler}
                        resetHandler={() => this.resetHandler(true)}/>
                </div>
                <Game
                    reset={this.state.reset}
                    onMount={() => this.resetHandler(false)}
                    width={this.state.width}
                    height={this.state.height}
                    mineCount={this.state.mines}
                    onGameOver={this.gameOverHandler}
                    gameWon={this.gameWonHandler}/>
            </div>
        );
    }
}

export default Minesweeper;