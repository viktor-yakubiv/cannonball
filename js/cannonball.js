

// Scene setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 100 );
camera.position.z = 20;
camera.position.y = 5;
camera.lookAt(new THREE.Vector3(15,0,0));

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var light = new THREE.PointLight( 0xdddddd, 10, 0 );
light.position.set( -10, 10, 10 );
scene.add( light );

//Setup ground
var geometry = new THREE.PlaneGeometry( 200, 100, 1 );
var texture = new THREE.TextureLoader().load( "img/grass-texture.jpg" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );
var material = new THREE.MeshLambertMaterial( {map: texture, side: THREE.DoubleSide} );
var plane = new THREE.Mesh( geometry, material );
plane.rotation.x=-Math.PI/2;
plane.position.x=70;
plane.position.y=-1.2;
scene.add( plane );

//Setup cannon ball
var ballGeometry = new THREE.SphereGeometry( 1, 10, 10 );
var ballMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );
var ball = new THREE.Mesh( ballGeometry, ballMaterial);

scene.add( ball );

// Constants
var velocity = 0.3;
var alpha = Math.PI/3;
var velocityX = velocity*Math.cos(alpha);
var velocityY = velocity*Math.sin(alpha);
var g=9.81/1000;

// Cannon setup
var cylinderGeometry = new THREE.CylinderGeometry( 1.1, 1, 5, 10 );
var cylinderMaterial = new THREE.MeshLambertMaterial( {color: 0xff0000} );
var cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial);
scene.add( cylinder );

cylinder.rotateZ(-Math.PI/2+alpha);

var wheelGeometry = new THREE.SphereGeometry( 1, 10, 10 );
var wheelMaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );
var wheel1 = new THREE.Mesh( wheelGeometry, wheelMaterial);
var wheel2 = new THREE.Mesh( wheelGeometry, wheelMaterial);

scene.add(wheel1);
scene.add(wheel2);

wheel1.translateZ(1);
wheel1.translateY(-1.2);
wheel1.translateX(-1.2);

wheel2.translateZ(-1);
wheel2.translateY(-1.2);
wheel2.translateX(-1.2);

// Controls using dat.gui
var gui = new dat.GUI();

var effectController = {
    angle: 45,
    velocity: 50
};

var valuesChanger = function() {
    alpha = effectController.angle*Math.PI/180;
    velocity= effectController.velocity*0.01;
    cylinder.rotation.z= -Math.PI/2+alpha;
};

var finishChanger = function() {
    position.y=-0.1;
    velocityX = velocity*Math.cos(alpha);
    velocityY = velocity*Math.sin(alpha);
    ball = new THREE.Mesh( ballGeometry, ballMaterial);
    scene.add(ball);
};

valuesChanger();


gui.add( effectController, "angle", 0.0, 90, 1.0 ).onChange( valuesChanger).onFinishChange(finishChanger);
gui.add( effectController, "velocity", 0.0, 100, 0.001 ).onChange( valuesChanger).onFinishChange(finishChanger);
gui.close();


scene.updateMatrixWorld(true);
var position = new THREE.Vector3();

// Draw function
var render = function () {
    requestAnimationFrame( render );
    position.getPositionFromMatrix( ball.matrixWorld );
    if(position.y>=0) {
        velocityY -= g; // v=v+at
        ball.translateX(velocityX);
        ball.translateY(velocityY - g / 2);
    }

    renderer.render(scene, camera);
};

render();
