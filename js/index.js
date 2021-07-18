import Cursor from "./cursor";
import {gsap} from "gsap";

const body = document.querySelector('body');

window.onload = () => {
  new Cursor(document.querySelector('.cursor'))

  body.classList.remove('loading')

  const tl = gsap.timeline();

  tl.from(body, {
    opacity: 0,
    duration: 1,
    ease: "Power3.easeInOut"
  })

  const header = document.querySelector('.hero-inner-title h1')
  tl.from(header, {
    duration: 0.7,
    y: '200%',
    ease: "Power1.easeOut"
  }, "-=0.8");

  [...document.querySelectorAll('.hero-inner-link-item a')].forEach(link => {
    tl.from(link, {
      duration: 0.8,
      y: '100%',
      ease: "Power1.easeOut"
    }, "-=0.4");
  });
};
