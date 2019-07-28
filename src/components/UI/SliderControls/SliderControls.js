import React from 'react';
import Slider from './Slider/Slider';
import Button from '../Button/Button';
import classes from './SliderControls.module.css';

const sliderControls = (props) => {
    return (
        <div className={classes.Container}>
            <Slider 
                label="Height"
                min={props.min}
                max={props.max}
                value={props.height}
                changeHandler={(event) => props.onSliderChangeHandler(event, 'height')}
            />
            <Slider 
                label="Width"
                min={props.min}
                max={props.max}
                value={props.width}
                changeHandler={(event) => props.onSliderChangeHandler(event, 'width')}
            />
            <Slider 
                label="Mines"
                min={props.min}
                max={props.maxMines}
                value={props.mines}
                changeHandler={(event) => props.onSliderChangeHandler(event, 'mines')}
            />
            <Button
                btnType="Success"
                clicked={props.resetHandler}>Play</Button>
        </div>
    );
}

export default sliderControls;