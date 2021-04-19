"use strict";
const apiUrl = "api/index.php";
let tic = 0;
let sec = 0;
console.log('page : scene.js');
console.log(WataConfThree.scene);
let container
    // -- Objets de la scene
let scene, camera, renderer, axesHelper, ambientlight
    // LES TEXTURES des objets
let cur_material = 0 // texture des cubes par default
let def_floor = 4; // texture sol par défault
let groupcomputersdata = []

// CAMERA
let cam_fov, cam_aspect, cam_fov_min, cam_fov_max, ratioxyz;
// TOOLS
let raycaster, mouse;
// CONTROLS
let controls;
// 3dObjects
let groupcube, groupMaps, groupcomputers;

addscriptstobody('vendor/three.min.js', 'three-js')
    .then(() => {
        addDomElement('ElementById', WataConfThree.scene.target.parentid, 'div', WataConfThree.scene.target.nameid, false);
        container = document.getElementById(WataConfThree.scene.target.nameid);
        GLTFLoader();
    })
    .catch(() => { console.error('Script loading failed! Handle this error'); });

function GLTFLoader() {
    addscriptstobody('vendor/GLTFLoader.js', 'GLTFLoader-js')
        .then(() => { OrbitControls(); })
        .catch(() => { console.error('GLTFLoader Script loading failed! Handle this error'); });
}

function OrbitControls() {
    addscriptstobody('vendor/OrbitControls.js', 'OrbitControls-js')
        .then(() => { threexdomevents(); })
        .catch(() => { console.error('OrbitControls Script loading failed! Handle this error'); });
}

function threexdomevents() {
    addscriptstobody('vendor/threex.domevents.js', 'threexdomevents-js')
        .then(() => { threexlinkify(); })
        .catch(() => { console.error('threexdomevents Script loading failed! Handle this error'); });
}

function threexlinkify() {
    addscriptstobody('vendor/threex.linkify.js', 'threexlinkify-js')
        .then(() => {
            creatScene();
            container.prepend(renderer.domElement);

            runSceneGetBoard();
        })
        .catch(() => { console.error('threexlinkify Script loading failed! Handle this error'); });
}

function creatScene() {
    console.log('script createscene mounted');
    // scene
    scene = new THREE.Scene();

    // update camera value first
    WataConfThree.scene.camera.cam_aspect = window.innerWidth / window.innerHeight;
    WataConfThree.scene.cam_ratioxyz = (WataConfThree.scene.floors[def_floor]['w'] * 2);
    // camera
    camera = new THREE.PerspectiveCamera(WataConfThree.scene.camera.cam_fov, WataConfThree.scene.camera.cam_aspect, WataConfThree.scene.camera.cam_fov_min, WataConfThree.scene.camera.cam_fov_max)
    camera.position.set(
        WataConfThree.scene.camera.x,
        (WataConfThree.scene.camera.y / 2),
        WataConfThree.scene.camera.z
    );
    // camera.position.set(0, 5, 20)
    camera.name = WataConfThree.scene.camera.nameid
    scene.add(camera);
    console.log(camera.name + ' ok')

    // axehelper ajout d'un objet "axehelper" pour faciliter la vue
    // activable in json config-three.json
    if (WataConfThree.scene.axehelper.active) {
        axesHelper = new THREE.AxesHelper(WataConfThree.scene.axehelper.length);
        axesHelper.position.set(
            WataConfThree.scene.axehelper.x,
            WataConfThree.scene.axehelper.y,
            WataConfThree.scene.axehelper.z
        );
        axesHelper.name = WataConfThree.scene.axehelper.nameid;
        scene.add(axesHelper);
        console.log(axesHelper.name + ' ok')
    }

    // ambientlight
    // new THREE.AmbientLight(WataConfThree.scene.ambientlight.color, WataConfThree.scene.ambientlight.data)
    // this one bug on color ????
    ambientlight = new THREE.AmbientLight(0x404040, WataConfThree.scene.ambientlight.data);
    ambientlight.name = WataConfThree.scene.ambientlight.nameid;
    scene.add(ambientlight);
    console.log(ambientlight.name + ' ok')


    // création du sol par défaut
    let maptexture = new THREE.TextureLoader().load(appRoot + WataConfThree.scene.floors[def_floor]['src']);
    maptexture.wrapS = THREE.RepeatWrapping;
    maptexture.wrapT = THREE.RepeatWrapping;
    maptexture.repeat.set(WataConfThree.scene.floors[def_floor]['repx'], WataConfThree.scene.floors[def_floor]['repy']);

    let mapGeometry = new THREE.PlaneBufferGeometry(WataConfThree.scene.floors[def_floor]['w'], WataConfThree.scene.floors[def_floor]['h']);
    let mapMaterial = new THREE.MeshBasicMaterial({ map: maptexture, opacity: 1, transparent: true });
    let mapCarte = new THREE.Mesh(mapGeometry, mapMaterial);
    mapCarte.position.set(
        ((WataConfThree.scene.floors[def_floor]['w'] / 2) - WataConfThree.scene.floors[def_floor]['decx']),
        0,
        ((WataConfThree.scene.floors[def_floor]['h'] / 2) - WataConfThree.scene.floors[def_floor]['decy']),
    );
    mapCarte.rotation.x = -Math.PI / 2;
    mapCarte.name = WataConfThree.scene.floors[def_floor]['nameid'];
    scene.add(mapCarte);



    groupcube = new THREE.Group();
    groupMaps = new THREE.Group();
    groupcomputers = new THREE.Group();

    //render
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // renderer.setClearColor(0x000000,0) // ???
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    console.log('renderer created')

    // raycaster = new THREE.Raycaster();
    // console.log('raycaster created')
    // mouse = new THREE.Vector2();
    // console.log('mouse created')
    if (WataConfThree.scene.controls.active) {
        console.log('WataConfThree.scene.controls.active:' + WataConfThree.scene.controls.active)
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = WataConfThree.scene.controls.enablezoom;
        controls.enableRotate = WataConfThree.scene.controls.enablerotate;
        controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
        controls.mouseButtons.RIGHT = THREE.MOUSE.DOLLY;
        controls.screenSpacePanning = WataConfThree.scene.controls.screenspacepanning;
    }
}




function runSceneGetBoard() {
    getJsonRouter({ action: 'getBoardDatas', token: sessionStorage.Wtoken });
    sceneLive();
}

function getBoardDatas(datas) {
    console.log('F>getBoardDatas');
    console.log(datas);
}

function sceneLive() {

    // if (sec >= 1000) {
    //     console.log('tic:' + tic);
    //     sec = 0; }
    // sec++;
    // tic++;

    renderer.render(scene, camera);
    if (typeof controls !== 'undefined') {
        controls.update();
    }
    requestAnimationFrame(sceneLive);
    // HoverCube();
}



//     // addDomElement('ElementById', currentThreeDiv, 'div', 'map3d', false)
//     // addDomElement('ElementById', 'map3d', 'div', 'watacarte', false)

// // let container = document.getElementById('watacarte')


// variables

// let map3d = document.getElementById('map3d')

// map3d.style.height = (window.innerHeight - map3d.offsetTop) + 'px'
//     // mapconsole.style.height = consoleHeight + 'px'
//     // console.log('map3d.offsetTop:' + map3d.offsetTop)
//     // console.log(window.innerHeight + '-' + map3d.offsetTop + '-' + consoleHeight + '=' + (window.innerHeight - map3d.offsetTop - consoleHeight))
//     // console.log(window.innerHeight + '-' + map3d.offsetTop + '=' + (window.innerHeight - map3d.offsetTop))