import React from 'react';
import classes from './Slider.module.css';

const slider = (props) => {
    return (
        <div className={classes.Container}>
            <p>{props.label} : {props.value}</p>
            <input className={classes.Slider} type="range" min={props.min} max={props.max} value={props.value} onChange={props.changeHandler}></input>
        </div>
    )
}

export default slider;