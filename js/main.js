import * as THREE from 'three';
import '/css/style.css'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap';

// Crée la scene ou placer les elements
const scene = new THREE.Scene();


//Taille de la fenetre 
const sizes = {
    width : window.innerWidth,
    height : window.innerHeight,
}

//Sphere 
//On crée la géométrie avec tous les points
const geometry = new THREE.SphereGeometry(3, 64, 64);

//Puis la texture pour étre visible
const material = new THREE.MeshStandardMaterial({
    color: "#00ff83",
    roughness: 0.5,
})

//Enfin on mélange les deux pour crée notre objet 
const mesh = new THREE.Mesh(geometry, material);

//Rajout de la caméra pour qu'on puisse voir la scene 
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100 )//45 Field of view, Limite du clippig 0.1 -> 100, 
camera.position.z = 20

//Création des lumières 
const light = new THREE.PointLight( 0xFFFFFF, 100,100)

//Position en X Y Z
light.position.set(0,10,10)
light.intensity = 200

//Je l'ajoute a la scene
scene.add(mesh)
scene.add(camera)
scene.add(light)





//Render permet de rendre avec le moteur graphique notre scene

const canvas = document.querySelector('.webgl')
const render = new THREE.WebGLRenderer({canvas})
render.setSize(sizes.width,sizes.height)
render.setPixelRatio(2) // Arrondi les bords pour éviter de donner cet aspect de pixel 
render.render(scene,camera)



//Controlls 

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false // Empeche de bouger le model
controls.enableZoom = false // Empeche de zoomer dans le model 
controls.autoRotate = true
controls.autoRotateSpeed = 10

//resize va changer la taille de l'element en fonciton de la taille de la fenetre


window.addEventListener("resize", () =>{
    //mise a jour des tailles
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    //update caméra 
    camera.updateProjectionMatrix()
    camera.aspect = sizes.width / sizes.height;
    //update render 
    render.setSize(sizes.width,sizes.height)
})


//Loop pour charger plusieur image pour faire aussi des animations 
const loop = () => {
    controls.update() // fait en sorte de mettre a jour les controll en temp reel pour eviter que cela ce stop net
    render.render(scene, camera)
    window.requestAnimationFrame(loop)
}
loop()


//timeline animation avec gsap 
const tl = gsap.timeline({defaults: {duration : 1}})
tl.fromTo(mesh.scale, {z:0, x: 0, y: 0}, {z:1,x:1,y:1})
tl.fromTo("nav", {y: "-100%"}, {y:"0%"})
tl.fromTo(".title", {opacity: "0"}, {opacity: "1"})


//souris animation 

let mouseDown = false
let rgb = []
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false))


window.addEventListener('mousemove', (e) =>{
    if(mouseDown){
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150,
        ]
    }

    //animation
    let newColor = new THREE.Color(`rgb(${rgb.join(',')})`)
    gsap.to(mesh.material.color,{
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
    })
})
