import {gsap} from "gsap";
import {lerp, getMousePos, getSiblings} from "./utils";

let mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", e => mouse = getMousePos(e));

export default class Cursor {
    constructor(el) {
        this.Cursor = el;
        this.Cursor.style.opacity = 0;
        this.Items = document.querySelectorAll('.hero-inner-link-item');
        this.Hero = document.querySelector('.hero-inner');

        const speed = 0.2
        this.cursorConfigs = {
            x: { previous: 0, current: 0, amt: speed },
            y: { previous: 0, current: 0, amt: speed }
        }

        //Define mouse move function
        this.onMouseMoveEv = () => {
            this.cursorConfigs.x.previous = this.cursorConfigs.x.current = mouse.x;
            this.cursorConfigs.y.previous = this.cursorConfigs.y.current = mouse.y;

            gsap.to(
                this.Cursor,
                {
                    duration: 1,
                    ease: "Power3.easeOut",
                    opacity: 1
                }
            )

            requestAnimationFrame(() => this.render())

            window.removeEventListener("mousemove", this.onMouseMoveEv)
        }

        window.addEventListener("mousemove", this.onMouseMoveEv);
    }

    render(){
        this.cursorConfigs.x.current = mouse.x;
        this.cursorConfigs.y.current = mouse.y;

        for (const key in this.cursorConfigs) {
            this.cursorConfigs[key].previous = lerp(
                this.cursorConfigs[key].previous,
                this.cursorConfigs[key].current,
                this.cursorConfigs[key].amt,
            )
        }

        this.Cursor.style.transform  = `translateX(${this.cursorConfigs.x.previous}px) translateY(${this.cursorConfigs.y.previous}px)`

        requestAnimationFrame(() => this.render())
    }
}