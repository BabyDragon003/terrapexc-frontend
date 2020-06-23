import { useState } from 'react';
import Draggable from "./Draggable";

const Slider = ({ setValue, disabled = false }) => {
  const [goto, setGoto] = useState(0);

  return (
    <div className="slider-container">
      <Draggable goto={goto} setValue={setValue} disabled={disabled} />
      <div className="slider-bar"></div>
      <div className="btn-slider-stepper" onClick={() => {setGoto(0); setValue(0)}}></div>
      <div className="btn-slider-stepper" onClick={() => {setGoto(25); setValue(25)}}></div>
      <div className="btn-slider-stepper" onClick={() => {setGoto(50); setValue(50)}}></div>
      <div className="btn-slider-stepper" onClick={() => {setGoto(75); setValue(75)}}></div>
      <div className="btn-slider-stepper" onClick={() => {setGoto(100); setValue(100)}}></div>
    </div>
  )
}

export default Slider;