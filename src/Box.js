import { BoxGeometry, MeshPhongMaterial, Mesh, Color } from "three"
import { bodies, meshes, world } from "./physics"
import { Box as PhysicBox, Body, Vec3  } from "cannon"
 
// refactor to class!! this.X/Y/Z

function Box(width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0, move = false, color = "red") { 
    this.geometry = new BoxGeometry(1, 1, 1);
    this.material = new MeshPhongMaterial({ color });
    Mesh.call(this, this.geometry, this.material);

    var shape = new PhysicBox(new Vec3(width/2, height/2, depth/2))
    var body = new Body({
        mass: move ? width* height * depth / 10 : 0,
        
    })
    body.position.set(x, y,z)
    body.addShape(shape) 
/*
    this.__doUpdate = function(x ,width){
        world.remove(body)
        body.position(x,y,z)

         shape = new PhysicBox(new Vec3(width / 2, height / 2, depth / 2))
         body = new Body({
            mass: move ? width * height * depth / 10 : 0,

        })
        body.position.set(x, y, z)
        body.addShape(shape)
        world.addBody(body);

        this.cube.position.x = x
        
    } 
*/
    //body.angularVelocity.set(0, .1, 0);
    body.applyImpulse(new Vec3(0, -1,0), new Vec3(0,0,0))
    body.angularDamping = 0.5;
    world.addBody(body);

    this.castShadow = true;
    this.receiveShadow = true;
    this.position.set(x, y, z) 
    this.scale.x = width
    this.scale.y = height
    this.scale.z = depth

    meshes.push(this) 
    bodies.push(body)  
}

Box.prototype = Object.create(Mesh.prototype);
Box.prototype.constructor = Box;

export default Box