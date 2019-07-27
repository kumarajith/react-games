import React, {Component} from 'react';
import Game from '../../components/Minesweeper/Game';
import SliderControls from '../../components/UI/SliderControls/SliderControls';
import Button from '../../components/UI/Button/Button';
class Minesweeper extends Component {
    state = {
        min: 1,
        max: 100,
        maxMines: 99,
        height: 10,
        width: 10,
        mines: 20,
        reset: true
    }

    onSliderChangeHandler = (event, type) => {
        this.setState({[type]: parseInt(event.target.value, 10), maxMines: ((this.state.height * this.state.width) - 1)});
        if (this.state.mines > this.state.maxMines) {
            this.setState({mines: this.state.maxMines});
        }
    }

    resetHandler = (status) => {
        this.setState({reset: status});
    }
    
    render () {
        return (
            <div>
                <SliderControls
                    min={this.state.min}
                    max={this.state.max}
                    height={this.state.height}
                    width={this.state.width}
                    mines={this.state.mines}
                    maxMines={this.state.maxMines}
                    onSliderChangeHandler={this.onSliderChangeHandler}/>
                <Button
                    btnType="Success"
                    clicked={() => this.resetHandler(true)}>Play</Button>
                <Game
                    reset={this.state.reset}
                    onMount={() => this.resetHandler(false)}
                    width={this.state.width}
                    height={this.state.height}
                    mineCount={this.state.mines}/>
            </div>
        );
    }
}

export default Minesweeper;