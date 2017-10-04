import { BoxGeometry, MeshPhongMaterial, Mesh, Color } from "three"
import { bodies, meshes, world } from "./physics"
import { Box as PhysicBox, Body, Vec3  } from "cannon"
   
export default class Box extends Mesh {
    constructor(width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0, move = false, color = "red") {
        let geometry = new BoxGeometry(1, 1, 1);
        let material = new MeshPhongMaterial({ color });
        let mass = width * height * depth  

        super(geometry, material);

        this.height = height
        this.width = width
        this.depth = depth

        this.shape = new PhysicBox(new Vec3(width / 2, height / 2, depth / 2))
        this.body = new Body({
            mass: move ? mass / 10 : 0  
        })
        this.body.position.set(x, y, z)  
        this.body.addShape(this.shape)
         
        this.castShadow = true;
        this.receiveShadow = true;
        this.position.set(x, y, z)
        this.scale.x = width
        this.scale.y = height
        this.scale.z = depth

        world.addBody(this.body);
        meshes.push(this)
    }
    update(x, y, z, width, height, depth, move) {
        world.remove(this.body) 

        this.shape = new PhysicBox(new Vec3(width / 2, height / 2, depth / 2))
        this.body = new Body({
            mass: move ? width * height * depth / 10 : 0,
        }) 
        this.body.position.set(x, y, z)
        this.body.addShape(this.shape)

        this.scale.x = width
        this.scale.y = height
        this.scale.z = depth
        this.position.x = x
        this.position.y = y
        this.position.z = z

        world.addBody(this.body);
    }
}

 