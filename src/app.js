import { WebGLRenderer, OrthographicCamera, Vector3, Color } from "three"
import scene, { addBox } from "./scene"
import { physicsTick, world } from "./physics"
import { Tween, Easing, update } from "tween.js"
import getIntersection from "./getIntersection"

const frustumSize = 100;
const aspect = window.innerWidth / window.innerHeight;
const camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -100, 1000);
const renderer = new WebGLRenderer({ antialias: true, alpha: false });

camera.position.set(-35, 35, -35)
//camera.up = new Vector3(0, 1, 0);
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
let c = ["red", "green", "blue", "purple"]
let vi = 0
let size = 25
let height = 5
let offset = 40
let duration = 4000
let i = 0
let boxes = [ ]
let left
let right
let hasInitalBox 
 

document.addEventListener("click", () => {
   // console.log(boxes)
    let y = (boxes.length- 1) * 5
    let b1 = boxes[boxes.length - 1]
    let color = c[vi++ % 4]
    let b2 = boxes[boxes.length - 2]
    let { height, x, leftover } = getIntersection(b1.box, b2.box) 
    let boxy = addBox(height, 5, size, -offset, y, 0, false, new Color(color))

    for(let lefty of leftover){
        if(lefty.height > 0 ){
            addBox(lefty.height, 5, size, lefty.x, lefty.y, 0, true, new Color(color)) 
        }
    }


    b1.box.scale.x = height
    b1.box.position.x = x

    let t1 = new Tween(camera.position)
        .to({ ...camera.position, y: camera.position.y + 5 }, 300)
        .easing(Easing.Back.Out)
        .start()

    left.stop()
    right.stop() 

    right = new Tween(boxy.position)
        .to({ ...boxy.position, x: offset, }, duration)
        .easing(Easing.Linear.None)

    left = new Tween(boxy.position)
        .to({ ...boxy.position, x: -offset, }, duration)
        .easing(Easing.Linear.None)

    right.chain(left).start()
    left.chain(right)

    camera.lookAt(new Vector3(0, y, 0))

    boxes.push({ height, x, box: boxy, color })
     
})  

let boxy2 = addBox(size, 40, size, 0, -offset/2 - 2.5, 0, false, "yellow")
boxes.push({box:boxy2})
let boxy = addBox(size, 5, size, -offset, 0, 0, false, new Color(Math.random(), Math.random(), Math.random()))

let t1 = new Tween(camera.position)
    .to({ ...camera.position, y: camera.position.y + 5 }, 300)
    .easing(Easing.Back.Out)
    .start()
  
right = new Tween(boxy.position)
    .to({ ...boxy.position, x: offset, }, duration)
    .easing(Easing.Linear.None)

left = new Tween(boxy.position)
    .to({ ...boxy.position, x: -offset, }, duration)
    .easing(Easing.Linear.None)

right.chain(left).start()
left.chain(right)

camera.lookAt(new Vector3(0, (boxes.length - 1) * 5, 0))

boxes.push({x: 0, height: size, box: boxy, color: "init"})