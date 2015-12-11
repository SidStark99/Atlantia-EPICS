var renderer, scene, camera, banana;

var ww = window.innerWidth,
  wh = window.innerHeight;

var riggedHandPlugin;
var historySamples;

function init() {
  (window.controller = new Leap.Controller)
    .use('screenPosition',{positioning: 'relative'})
    .use('riggedHand')
    .connect()
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('scene')
  });
  renderer.setSize(ww, wh);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, ww / wh, 0.1, 10000);
  camera.position.set(0, 0, 1000);
  scene.add(camera);
    var texture = THREE.ImageUtils.loadTexture('./assets/background-01.jpg');
        var backgroundMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2, 0),
            new THREE.MeshBasicMaterial({
                map: texture
            }));

  backgroundMesh .material.depthTest = false;
  backgroundMesh .material.depthWrite = false;

        // Create your background scene
  backgroundScene = new THREE.Scene();
  backgroundCamera = new THREE.Camera();
  backgroundScene .add(backgroundCamera );
  backgroundScene .add(backgroundMesh );
  //Add a light in the scene
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 0, 350);
  directionalLight.lookAt(new THREE.Vector3(0, 0, 0));
  scene.add(directionalLight);

  //Load the obj file
 
  loadOBJ();
}

var loadOBJ = function() {

  //Manager from ThreeJs to track a loader and its status
  var manager = new THREE.LoadingManager();
  //Loader for Obj from Three.js
  var loader = new THREE.OBJLoader(manager);
  //Launch loading of the obj file, addBananaInScene is the callback when it's ready 
  loader.load('http://mamboleoo.be/learnThree/demos/banana.obj', addBananaInScene);

};

var addBananaInScene = function(object) {
  banana = object;
  //Move the banana in the scene
  banana.rotation.x = Math.PI /2;
  banana.position.y = -10;
  banana.position.z = 90;
  banana.rotation.z=Math.PI/4;
  //Go through all children of the loaded object and search for a Mesh
  object.traverse(function(child) {
    //This allow us to check if the children is an instance of the Mesh constructor
    if (child instanceof THREE.Mesh) {
      child.material.color = new THREE.Color("yellow");
      //Sometimes there are some vertex normals missing in the .obj files, ThreeJs will compute them
      child.geometry.computeVertexNormals();
    }
  });
  //Add the 3D object in the scene
  scene.add(banana);
  render();
};

var render = function() {
  requestAnimationFrame(render);

  //Turn the banana
  //banana.rotation.z += .01;
  renderer.autoClear = false;
  renderer.clear();
    renderer.render(backgroundScene , backgroundCamera );
  renderer.render(scene, camera);
};

init();