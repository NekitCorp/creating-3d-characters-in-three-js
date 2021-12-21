import { Figure } from "./figure";
import { Scene } from "./scene";

const scene = new Scene(document.querySelector("[data-canvas]") as HTMLCanvasElement, {
    width: window.innerWidth,
    height: window.innerHeight,
});

const figure1 = new Figure({}, scene);
figure1.init();

const figure2 = new Figure({ x: 4 }, scene);
figure2.init();

const figure3 = new Figure({ x: -4 }, scene);
figure3.init();
