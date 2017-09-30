import { WebGLRenderer, OrthographicCamera, Vector3, Color } from "three"
import scene, { addBox } from "./scene"
import { physicsTick, world } from "./physics"
import { Tween, Easing, update } from "tween.js"

const frustumSize = 100;
const aspect = window.innerWidth / window.innerHeight;
const camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -100, 1000);
const renderer = new WebGLRenderer({ antialias: true, alpha: false });

camera.position.set(-35, 35, -35)
camera.up = new Vector3(0, 1, 0);
camera.lookAt(new Vector3())

renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);


function tick() {
    requestAnimationFrame(tick);

    physicsTick()
    update()
    renderer.render(scene, camera);
};

tick();
let size = 25
let height = 5
let offset = 40
let duration = 2000
let i = 0
let boxes = []
let left
let right

function getIntersection(current, previous) {
    if(!current && !previous) {
        return  { width: size }
    }
    if(!previous) {
        previous = {
            position: {
                x: 0
            },
            geometry:{parameters: { width: size }}
        }
    }

    let w = previous.geometry.parameters.width

    let delta = Math.abs((current.position.x + (w/2)) - (previous.position.x + (w/2)))
    
    return { width: delta > w ? 0 : w - delta }
}

document.addEventListener("click", () => { 
    console.log(boxes)
    let { width } = getIntersection(boxes[boxes.length - 1], boxes[boxes.length - 2] )
    let y = i++ * 5
    let boxy = addBox(width, 5, size, -offset, y, 0, false, new Color(Math.random(), Math.random(), Math.random())) 

    let t1 = new Tween(camera.position)
        .to({ ...camera.position, y: camera.position.y + 5 }, 300)
        .easing(Easing.Back.Out)
        .start()

    if (left) {
        left.stop()
        right.stop()
    }

    right = new Tween(boxy.position)
        .to({ ...boxy.position, x: offset, }, duration)
        .easing(Easing.Linear.None)

    left = new Tween(boxy.position)
        .to({ ...boxy.position, x: -offset, }, duration)
        .easing(Easing.Linear.None)

    right.chain(left).start()
    left.chain(right)

    camera.lookAt(new Vector3(0, y, 0))

    boxes.push(boxy)
}) 