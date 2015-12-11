var riggedHandPlugin;

var ww = window.innerWidth;
var wh = window.innerHeight;
var renderer,camera;
var historySamples;

var controller = Leap.loop(function(frame){
    if(frame.hands.length > 0)
    {
        var hand = frame.hands[0];
        var position = hand.palmPosition;
        var velocity = hand.palmVelocity;
        var direction = hand.direction;
    }
});

function init(){
    Leap.loop({
      hand: function(hand){
        var label = hand.data('label');
        //var locationlabel=hand.data('locationlabel');
        // if(!locationlabel){
        //   locationlabel=document.createElement('label');
        //   document.body.appendChild(locationlabel);
        // }
        if (!label){

          label = document.createElement('label');
          document.body.appendChild(label);

          /**
           * Here we set the label to show the hand type
           */
          label.innerHTML = hand.type + " hand";

          hand.data('label', label)

        }


        var handMesh = hand.data('riggedHand.mesh');

        var screenPosition = handMesh.screenPosition(
          hand.palmPosition,
          riggedHandPlugin.camera
        );
        label.style.left = screenPosition.x + 'px'; //co-ordinates for hand for later use in interactivity
        label.style.bottom = screenPosition.y + 'px'; //co-ordinates for hand for later use in interactivity
        //locationlabel.innerHTML = hand.direction;
        if(hand.grabStrength == 1){
          label.innerHTML = "closed hand";
        }
        else if(hand.grabStrength == 0){
          label.innerHTML = "open hand";
        }
        else{
          var sum=0;
          for(var s = 0; s < historySamples; s++){
            var oldHand = controller.frame(s).hand(hand.id)
            if(!oldHand.valid) break;
            sum += oldHand.grabStrength
        }
        var avg = sum/s;
        if(hand.grabStrength - avg > 0) {
          label.innerHTML = "hand is opening";
        }
        else if (hand.grabStrength > 0) {
            label.innerHTML =  "hand is closing"; 
        }
        }
      }
    })
    .use('riggedHand')
    .use('handEntry')
    .on('handLost', function(hand){
        var label = hand.data('label');
        if (label){
          document.body.removeChild(label);
          hand.data({label: undefined});
        }
    });

    riggedHandPlugin = Leap.loopController.plugins.riggedHand;
    //sceneInit();
  }
// function sceneInit(){
//   var scene = new THREE.Scene();
//   camera = new THREE.PerspectiveCamera(75,ww/wh,0.1,1000);
//   renderer=new THREE.WebGLRenderer({
//     canvas: document.getElementById('scene')
//   });
//   renderer.setSize(ww/10,wh/10);
//   document.body.appendChild(renderer.domElement);
//   scene.add(camera);

//   directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
//   directionalLight.position.set( 0, 0, 350 );
//   directionalLight.lookAt(new THREE.Vector3(0,0,0));
//   scene.add( directionalLight );

//  // loadOBJ();
// }
// var loadOBJ = function(){
//   var manager = new THREE.LoadingManager();
//   //Loader for Obj from Three.js
//   var loader = new THREE.OBJLoader( manager );
//   //Launch loading of the obj file, addBananaInScene is the callback when it's ready 
//   loader.load( 'http://mamboleoo.be/learnThree/demos/banana.obj', addBananaInScene);
// };

// var addBananaInScene = function(object){
//   banana = object;
//   //Move the banana in the scene
//   banana.rotation.x = Math.PI/2;
//   banana.position.y = -200;
//   banana.position.z = 50;
//   //Go through all children of the loaded object and search for a Mesh
//   object.traverse( function ( child ) {
//     //This allow us to check if the children is an instance of the Mesh constructor
//     if(child instanceof THREE.Mesh){
//       child.material.color = new THREE.Color(0X00FF00);
//       //Sometimes there are some vertex normals missing in the .obj files, ThreeJs will compute them
//       child.geometry.computeVertexNormals();
//     }
//   });
//   //Add the 3D object in the scene
//   scene.add(banana);
//   render();
// };

// var render = function () {
//   requestAnimationFrame(render);

//   //Turn the banana
//   banana.rotation.z += .01;

//   renderer.render(scene, camera);
// };
init();
