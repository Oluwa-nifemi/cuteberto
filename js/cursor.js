import {gsap} from "gsap";
import {getMousePos, getSiblings, lerp} from "./utils";

let mouse = {x: 0, y: 0};

export default class Cursor {
    constructor(el) {
        this.Cursor = el;
        this.Cursor.style.opacity = 0;

        //Elements
        this.Items = document.querySelectorAll('.hero-inner-link-item');
        this.Hero = document.querySelector('.hero-inner');
        this.Hamburger = document.querySelector('.header-inner-nav-menu-hamburger');

        const burgerPosition = this.Hamburger.getBoundingClientRect();
        this.HamburgerCenter = {
            x: (burgerPosition.x + burgerPosition.width / 2),
            y: (burgerPosition.y + burgerPosition.height / 2)
        }

        this.HamburgerPosition = {
            x: {
                previous: 0,
                current: 0
            },
            y: {
                previous: 0,
                current: 0
            }
        }

        const speed = 0.2
        this.cursorConfigs = {
            x: {previous: 0, current: 0, amt: speed},
            y: {previous: 0, current: 0, amt: speed}
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
            this.onHoverBurger();

            requestAnimationFrame(() => this.render())

            window.removeEventListener("mousemove", this.onMouseMoveEv)
        }

        window.addEventListener("mousemove", e => {
            //If we're not being magnetic just set the correct mouse position
            if (!this.magnetic) {
                mouse = getMousePos(e)
            } else {
                const mousePosition = getMousePos(e);
                //Distance between mouse and hamburger center
                const distX = mousePosition.x - this.HamburgerCenter.x;
                const distY = mousePosition.y - this.HamburgerCenter.y;

                const threshold = 140;

                //If we're more than 140px away from the center either horizontally or vertically
                // return to normal mouse position and style burger back
                if (Math.abs(distX) > threshold || Math.abs(distY) > threshold) {
                    this.magnetic = false;
                    this.Cursor.style.setProperty('--scale', 1);
                    this.Hamburger.classList.remove('white-lines')
                    this.HamburgerPosition.x.current = 0
                    this.HamburgerPosition.y.current = 0
                } else {
                    //Else calculate the percentage distance relative to the threshold then over a 15px range and move the mouse to there
                    mouse.x = ((distX / threshold) * 15) + this.HamburgerCenter.x;
                    mouse.y = ((distY / threshold) * 15) + this.HamburgerCenter.y;
                    //Also position the hamburger for 12px and render the burger
                    this.HamburgerPosition.x.current = (distX / threshold) * 12
                    this.HamburgerPosition.y.current = (distY / threshold) * 12
                    requestAnimationFrame(() => this.renderBurger());
                }
            }
        });

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
        this.Cursor.style.transform = `translateX(${this.cursorConfigs.x.previous}px) translateY(${this.cursorConfigs.y.previous}px)`

        requestAnimationFrame(() => this.render())
    }

    renderBurger(){
        //If the current is 0 (meaning we're resetting burger back to it's position and the position we're at is basically negligible then just cancel the animation frame
        if(this.HamburgerPosition.x.current === 0 && Math.abs(this.HamburgerPosition.x.previous) < 0.001 ){
            cancelAnimationFrame(this.burgerRaf)
            return
        }

        //Else linear interpolate and position
        for (const key in this.HamburgerPosition) {
            this.HamburgerPosition[key].previous = lerp(
                this.HamburgerPosition[key].previous,
                this.HamburgerPosition[key].current,
                0.2,
            )
        }

        this.Hamburger.style.transform = `translateX(${this.HamburgerPosition.x.previous}px) translateY(${this.HamburgerPosition.y.previous}px)`

        this.burgerRaf = requestAnimationFrame(() => this.renderBurger());
    }

    //Scale the mouse up on link hover
    onScaleMouse() {
        this.Items.forEach((link) => {
            if (link.matches(':hover')) {
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

    activateVideo(el) {
        const id = el.getAttribute('data-video-src');
        const video = document.getElementById(id);
        const siblings = getSiblings(video);
        this.setOpacity(video, 1);
        siblings.forEach(item => this.setOpacity(item, 0));
    }

    //Opacity Animation
    setOpacity(el, opacity) {
        gsap.set(
            el,
            {
                opacity
            }
        )
    }

    //Scale animation
    scaleAnimation(el, amt) {
        gsap.to(
            el,
            {
                duration: 0.6,
                scale: amt,
                ease: "Power3.easeout"
            }
        )
    }

    //On Hover Burger
    onHoverBurger() {
        const burgerMove = () => {
            //If we hover the burger's surroundings snap up the cursor and scale it up and show the spans
            mouse.x = this.HamburgerCenter.x;
            mouse.y = this.HamburgerCenter.y;
            this.Cursor.style.setProperty('--scale', 7);
            this.Hamburger.classList.add('white-lines')
            this.magnetic = true;
        };

        this.Hamburger.addEventListener('mouseenter', burgerMove)
    }
}