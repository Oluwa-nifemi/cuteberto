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
        this.Videos = document.querySelectorAll('.cursor-media video');

        const speed = 0.2
        this.cursorConfigs = {
            x: { previous: 0, current: 0, amt: speed },
            y: { previous: 0, current: 0, amt: speed }
        }

        //Define mouse move function
        this.onMouseMoveEv = (e) => {
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

            this.onScaleMouse();

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

        //Move cursor to calculated position
        this.Cursor.style.transform  = `translateX(${this.cursorConfigs.x.previous}px) translateY(${this.cursorConfigs.y.previous}px)`

        requestAnimationFrame(() => this.render())
    }

    //Scale the mouse up on link hover
    onScaleMouse(){
        this.Items.forEach((link, idx) => {
            if(link.matches(':hover')) {
                this.scaleAnimation(
                    //The cursor-media element
                    this.Cursor.children[0],
                    0.6
                )

                this.activateVideo(link)
            }

            //Scale up by 0.8 on mouse enter
            link.addEventListener("mouseenter", () => {
                this.scaleAnimation(
                    //The cursor-media element
                    this.Cursor.children[0],
                    0.6
                )

                this.activateVideo(link)
            })

            //Scale back down on mouse leave
            link.addEventListener("mouseleave", () => {
                this.scaleAnimation(
                    //The cursor-media element
                    this.Cursor.children[0],
                    0
                )
            })

            //Scale up to 1.2 when hover over actual content
            link.children[1].addEventListener("mouseenter", () => {
                this.Cursor.classList.add("media-blend")
                this.scaleAnimation(
                    //The cursor-media element
                    this.Cursor.children[0],
                    1
                )
            })

            //Scale back down when leave
            link.children[1].addEventListener("mouseleave", () => {
                this.Cursor.classList.remove("media-blend")
                this.scaleAnimation(
                    //The cursor-media element
                    this.Cursor.children[0],
                    0.6
                )
            })
        })

        this.currentScale = lerp(
            this.currentScale,
            20,
            0.2
        )

        this.Cursor.style.transform = `translateX(${this.cursorConfigs.x.previous}px) translateY(${this.cursorConfigs.y.previous}px) scale(${this.currentScale})`
    }

    activateVideo(el){
        const id = el.getAttribute('data-video-src');
        const video = document.getElementById(id);
        console.log(video, el)
        const siblings = getSiblings(video);
        this.setOpacity(video, 1);
        siblings.forEach(item => this.setOpacity(item, 0));
    }

    //Opacity Animation
    setOpacity(el, opacity){
        gsap.set(
            el,
            {
                opacity
            }
        )
    }

    //Scale animation
    scaleAnimation(el, amt){
        gsap.to(
            el,
            {
                duration: 0.6,
                scale: amt,
                ease: "Power3.easeout"
            }
        )
    }
}