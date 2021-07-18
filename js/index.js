import Cursor from "./cursor";
import {gsap} from "gsap";

const body = document.querySelector('body');

window.onload = () => {
  new Cursor(document.querySelector('.cursor'))

  body.classList.remove('loading')
  gsap.from(body, {
    opacity: 0,
    duration: 1,
    ease: "Power3.easeInOut"
  })
};
