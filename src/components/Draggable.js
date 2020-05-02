import { useEffect, useRef, useState } from "react";

const Draggable = (props) => {
  const container = useRef();
  const dragItem = useRef();
  const tooltip = useRef();
  const pos1 = useRef();
  const pos2 = useRef();
  const [isDown, setIsDown] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (props.disabled) {
      goToStepper(0);
    } else {
      goToStepper(props.goto);
    }
  }, [props.goto, props.disabled])

  const goToStepper = (step) => {
    setValue(step);
    tooltip.current.style.left = container.current.offsetWidth * (step / 100) + "px";
    dragItem.current.style.left = container.current.offsetWidth * (step / 100) + "px";
  }

    // calculate the new cursor position:
    pos1.current = pos2.current - e.clientX;
    var posx = dragItem.current.offsetLeft - pos1.current;
    if (posx < 0) {
      posx = 0;
      return;
    }
    if (posx > container.current.offsetWidth) {
      posx = container.current.offsetWidth;
      return;
    }
    pos2.current = e.clientX;
    tooltip.current.style.left = posx + "px";
    dragItem.current.style.left = posx + "px";
    const pos = Math.floor(posx / container.current.offsetWidth * 100);
    setValue(pos);
    props.setValue(pos);
  }

  return (
    <div className="draggable-container" id="draggable-container" ref={container} onMouseDown={dragMouseDown}>
      <label className="slider-tooltip" ref={tooltip}>{value}%</label>
      <div className={`btn-slider ${isDown ? "active" : ""}`} id="draggable" ref={dragItem} />
    </div>
  )
}

export default Draggable;