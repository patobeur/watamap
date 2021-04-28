"use strict";
if (Wlog) { console.log('Scene Mounting...'); }

let tic = 0;
let sec = 0;
// if(Wlog) console.log('page : scene.js');
// if(Wlog) console.log(WataConfThree.scene);
let container
    // -- Objets de la scene
let scene, camera, renderer, axesHelper, ambientlight, ScenePixelRatio = 30
    // -- Objets test pour groupe camera 2 avec les données de la 1 afin de switcher quand c bon !
let cameraDeux
    // LES TEXTURES des objets
let cur_material = 0 // texture des cubes par default
let def_floor = 4; // texture sol par défault
let groupcomputersdata = []

// CAMERA
let cam_fov, cam_aspect, cam_fov_min, cam_fov_max, ratioxyz;
// TOOLS
let raycaster = false,
    mouse = true;
// CONTROLS
let controls;
// 3dObjects
let groupcube, groupMaps, groupcomputers, grouptest;
let grpcameraDeux

// scripts loading
threeLoader();

function creatScene() {
    // if(Wlog) console.log('script createscene mounted');
    // scene
    scene = new THREE.Scene();
    // update camera value first
    WataConfThree.scene.camera.cam_aspect = window.innerWidth / window.innerHeight;
    WataConfThree.scene.cam_startdist = (WataConfThree.scene.floors[def_floor]['w'] * 2);
    // camera
    camera = new THREE.PerspectiveCamera(WataConfThree.scene.camera.cam_fov, WataConfThree.scene.camera.cam_aspect, WataConfThree.scene.camera.cam_fov_min, WataConfThree.scene.camera.cam_fov_max)
    camera.position.set(
        // WataConfThree.scene.camera.x + WataConfThree.scene.cam_startdist,
        0,
        WataConfThree.scene.camera.y + WataConfThree.scene.cam_startdist,
        WataConfThree.scene.camera.z + WataConfThree.scene.cam_startdist
    );
    // camera.position.set(0, 5, 20)
    camera.name = WataConfThree.scene.camera.nameid
    grpcameraDeux = new THREE.Group();
    grpcameraDeux.add(camera);
    // scene.add(camera);
    scene.add(grpcameraDeux);
    // if(Wlog) console.log(camera.name + ' ok')
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
        // if(Wlog) console.log(axesHelper.name + ' ok')
    }

    // ambientlight
    // new THREE.AmbientLight(WataConfThree.scene.ambientlight.color, WataConfThree.scene.ambientlight.data)
    // this one bug on color ????
    ambientlight = new THREE.AmbientLight(0x404040, WataConfThree.scene.ambientlight.data);
    ambientlight.name = WataConfThree.scene.ambientlight.nameid;
    scene.add(ambientlight);
    // if(Wlog) console.log(ambientlight.name + ' ok')


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
    grouptest = new THREE.Group();
    groupMaps = new THREE.Group();
    groupcomputers = new THREE.Group();
    grouptest.position.set(0.5, 0.5, 0.5)
    scene.add(grouptest);


    //render
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // renderer.setClearColor(0x000000,0) // ???
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // if(Wlog) console.log('renderer created')

    raycaster = new THREE.Raycaster();
    // if(Wlog) console.log('raycaster created')

    mouse = new THREE.Vector2();
    if (mouse) {
        container.addEventListener('mousemove', onMouseMove, false);
    }
    if (Wlog) console.log('mouse created')

    if (WataConfThree.scene.controls.active) {
        // if(Wlog) console.log('WataConfThree.scene.controls.active:' + WataConfThree.scene.controls.active)
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = WataConfThree.scene.controls.enablezoom;
        controls.enableRotate = WataConfThree.scene.controls.enablerotate;
        controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
        controls.mouseButtons.RIGHT = THREE.MOUSE.DOLLY;
        controls.screenSpacePanning = WataConfThree.scene.controls.screenspacepanning;
    }
}




function runSceneGetBoard() {
    sceneLive();
    getActionRouter({ action: 'getHtmlBoardDatas', token: sessionStorage.Wtoken });
    // getActionRouter({ action: 'getAliveUsers', token: sessionStorage.Wtoken });
    // getActionRouter({ action: 'getHtmlBoardDatas', token: sessionStorage.Wtoken });
}

function getHtmlBoardDatas(datas) {
    if (datas) {
        addHtmlDashboard(datas)
            // container.prepend(renderer.domElement);
        if (Wlog) console.log('F>getHtmlBoardDatas');
    }
}

function getAliveUsers(datas) {
    if (Wlog) console.log('F>getAliveUsers');
    if (Wlog) console.log(datas);
}

function sceneLive() {
    // if (sec >= 1000) {
    //     if(Wlog) console.log('tic:' + tic);
    //     sec = 0; }
    // sec++;
    // tic++;
    if (grouptest.feun) {
        console.log("ok")
            // cubeRotate();
    }
    renderscene();
    if (typeof controls !== 'undefined') { controls.update(); }
    requestAnimationFrame(sceneLive);
}

function renderscene() {
    renderer.render(scene, camera);
}
// ----------------------------------------------------------------
function threeLoader() {
    addscriptstobody('vendor/three.min.js', 'three-js')
        .then(() => {
            addDomElement('ElementById', WataConfThree.scene.target.parentid, 'div', WataConfThree.scene.target.nameid, false);
            container = document.getElementById(WataConfThree.scene.target.nameid);
            GLTFLoader();
        })
        .catch(() => { console.error('Script loading failed! Handle this error'); });
}

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

            // get jsons

            getJsonThreeLibrarie(appRoot + 'api_js/json/threelibrarie.json');
            runSceneGetBoard();


        })
        .catch(() => { console.error('threexlinkify Script loading failed! Handle this error'); });
}
//Listeners
window.addEventListener('resize', () => {
    if (Wlog) { console.log(container.cli); }
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, (container.clientHeight))
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, ScenePixelRatio))
});

function onMouseMove(event) {
    mouse.x = (event.clientX / (container.clientWidth)) * 2 - 1
    mouse.y = -(event.clientY / (container.clientHeight)) * 2 + 1
        // if(Wlog) {console.log(mouse.x, mouse.y);}
}

function addCube() {
    let wgeometry = new THREE.BoxGeometry(1, 1, 1);
    let wmaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let wcube = new THREE.Mesh(wgeometry, wmaterial);
    wcube.castShadow = true
    wcube.name = 'feun';
    console.log('wcube' + wcube.id)
    grouptest.add(wcube);
}

function cubeRotate() {
    if (grouptest) {
        grouptest.rotation.x += 0.01;
        grouptest.rotation.y += 0.01;
    }
}