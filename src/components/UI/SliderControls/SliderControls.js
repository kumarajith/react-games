import React from 'react';
import Slider from './Slider/Slider';

const sliderControls = (props) => {
    return (
        <div>
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
        </div>
    );
}

export default sliderControls;