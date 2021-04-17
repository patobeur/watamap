"use strict";

localStorage.appToken = false
sessionStorage.appRoot = "watamap/"
sessionStorage.curV = "?v=" + new Date().getSeconds()

console.log(sessionStorage)


// if (myStorage.Feun) { delete myStorage.Feun }
// if (myStorage.WataConf) { delete myStorage.WataConf }
// if (sessionStorage.WataConf) { delete sessionStorage.WataConf }
// if (sessionStorage.Email) { delete sessionStorage.Email }
if (sessionStorage.Wtf) { delete sessionStorage.Wtf }
// if (myStorage.Email) { delete myStorage.Email }
// if (myStorage.DefLoging) { delete myStorage.DefLoging }
// console.log(myStorage)
// console.log(mySession)

let WataConf = [] // temporary conf waiting to be inserted in localStorage and/or sessionStorage




// let DomTargetId = "watacarte" // overwrite WataConf.DomTargetId ???
window.onload = function getconfig(e) {
    // get config json file before anything else
    // console.log(sessionStorage.WtF)
    getJsonConfig(sessionStorage.appRoot + "api_js/config.json")
}

function getJsonConfig(jsonfile) {
    readTextFile(jsonfile + sessionStorage.curV, (textjson) => {
        console.log('Config reçus !')
        WataConf = JSON.parse(textjson)
        if (WataConf) {
            console.log('Fichier Conf OK ')
            console.log('WataConf OK ')
            console.log('sessionStorage.WtF json OK ')
                // sessionStorage.WtF = textjson
                // addsessionStorage(textjson)
            startlogin()
        } else { console.log('erreur de config !') }
    });
}

function startlogin() {
    addNewcss()
        // addscriptstoheader()
    addscriptstobottom()
        // from here only poped up scripts will run
        // theoricaly !!!
        // addScriptBy('DomId', 'fullpage', scripts[i])
}

function checkConnection(profildatas) {
    if (profildatas) {
        if (profildatas[0] === true) {
            console.log('Vous êtes connecté(é) !')
            console.log('mail stocké !')
            WataConf.DefLoging.login = document.getElementById('datalogin').value
            localStorage.Email = document.getElementById('datalogin').value
            addsessionStorage(profildatas)
            nextToLoging(profildatas)
        } else {
            console.log('Connecting people: erreur émise par le serveur !')
        }
    } else {
        console.log('Vide ??? ou inconnue !')
    }
}

// addSession('sessionStorage||localStorage')
function addlocaStorage(datas) {
    datas = JSON.parse(datas[1])[0]
    Object.keys(datas).forEach((key) => {
        localStorage[key] = datas[key]
    });
}

function addsessionStorage(datas) {
    datas = JSON.parse(datas[1])[0]
    Object.keys(datas).forEach((key) => {
        sessionStorage[key] = datas[key]
    });
}

function nextToLoging(profildatas) {

    // myStorage.Email = WataConf.DefLoging.login
    console.log(profildatas)
    if (profildatas) {
        // console.log(profildatas)
        console.log('myStorage')
        console.log(localStorage)
        console.log('mySession')
        console.log(sessionStorage)
            // clear the form values
            // to do .......
            // remove form from dom
        document.getElementById(WataConf.ConnectingDivId).remove()
            // remove script login from dom
        document.getElementById('login-js').remove()
            // creat buttons for actions
            // create selects inputs
            // clear remove css
    }


}

// <link rel="preconnect" href="https://fonts.gstatic.com">
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato&display=swap">


function addScriptBy(getElementsBytype, targetname, element) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = sessionStorage.appRoot + element.url + sessionStorage.curV
    script.id = element.id
    if (getElementsBytype === 'TagName') { document.getElementsByTagName(targetname)[0].appendChild(script) } // multiple possible !!!!!!
    else if (getElementsBytype === 'DomId') { document.getElementById(targetname).appendChild(script) } // only the One Id
}

function addscriptstoheader() {
    let scripts = WataConf.HeaderJs
    for (let i = 0; i < scripts.length; i++) { addScriptBy('TagName', 'head', scripts[i]) } // Only Array
    // scripts.array.forEach(element => {addScriptTo('head', element)});        // Only Objects
}

function addthisscriptstoheader() {
    let scripts = WataConf.HeaderJs
    for (let i = 0; i < scripts.length; i++) { addScriptBy('TagName', 'head', scripts[i]) } // Only Array
    // scripts.array.forEach(element => {addScriptTo('head', element)});        // Only Objects
}

function addscriptstobottom() {
    let scripts = WataConf.BottomJs
    for (let i = 0; i < scripts.length; i++) { addScriptBy('TagName', 'body', scripts[i]) }
}

function addNewcss() {
    let csss = WataConf.LoginCss
    for (let i = 0; i < csss.length; i++) { addCss('TagName', 'head', csss[i]) }
}

function addCss(getElementsBytype, targetname, element) {
    var script = document.createElement('link');
    script.type = 'text/css'
    script.href = sessionStorage.appRoot + element.url + sessionStorage.curV
    script.rel = "stylesheet"
    script.id = element.id
    document.getElementsByTagName(targetname)[0].appendChild(script);
}


function addDomElement(getElementsBytype, targetname, elementtype, identity) {
    // console.log(document.getElementById(targetname).parentElement)
    // addDomElement('DomId', WataConf.DomTargetId, 'div')
    var newelement = document.createElement(elementtype)
    newelement.id = identity
    if (getElementsBytype === 'TagName') { document.getElementsByTagName(targetname)[0].appendChild(newelement) } // multiple possible !!!!!!
    else if (getElementsBytype === 'DomIdParent') { document.getElementById(targetname).parentElement.appendChild(newelement) } // only the One Id
    else if (getElementsBytype === 'DomId') { document.getElementById(targetname).appendChild(newelement) } // only the One Id
}

function addContentToElement(targetname, textcontent) {
    var newelement = document.createElement('p');
    newelement.textContent = textcontent
    document.getElementById(targetname).appendChild(newelement)
}

function readTextFile(file, callback) {
    //https://stackoverflow.com/questions/6711002/how-can-i-get-javascript-to-read-from-a-json-file
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function clog(datas = false) {
    if (WataConf.FConsole.active && datas) {
        WataConf.FConsole.count++
            console.log(datas)
    }
}

function getJsonDatas(query) {
    if (query) {
        getJson(
            sessionStorage.appRoot + WataConf.Appy.apiUrl,
            JSON.stringify(query),
            (datas) => {
                // console.log(datas)
                // console.log('Paquet reçus pour: "' + query['action'] + '" de type "' + typeof datas) + '"'
                // console.log(datas)
                switch (query['action']) {
                    case 'getMapListeByClientId':
                        getMapListeByClientId(ResponsetoJson(datas));
                        break;
                    case 'addGroupeToScene':
                        addGroupeToScene(ResponsetoJson(datas));
                        break;
                    case 'getConfig':
                        startConfig(ResponsetoJson(datas));
                        break;
                    case 'addComputersToScene':
                        addComputersToScene(ResponsetoJson(datas));
                        break;
                    case 'tryGetLogued':
                        checkConnection(ResponsetoJson(datas))
                        break;
                    default:
                        console.log(`Sorry, mais nous n'avons plus de  ${query['action']}.`);
                }
            });
    }
}


function ResponsetoJson(string) {
    if (string) {
        if (JSON.parse(string)[0] === true) {
            let jssondata = JSON.parse(string)
            return jssondata
        }
    }
    return false
}
// ----------------------------------------------------------------
function getJson(url, para, success) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.status != 200) {
            console.log('Soudain un problème !!')
        } else if (xhr.readyState === 2 && xhr.status == 200) {
            // console.log('Demande en cours ...')
        } else if (xhr.readyState === 3 && xhr.status == 200) {
            // console.log('Ne quittez pas !')
        } else if (xhr.readyState > 3 && xhr.status == 200) {
            // console.log('Paquet livré ! (' + typeof xhr.responseText + '/' + xhr.responseText.length + ')')
            success(xhr.responseText);
        }
    };
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("data=" + para);
    return xhr;
}
// $.getScript('base64.js');
// var encoded = "YWxlcnQoImhpIik7DQo="; //More text
// var decoded = decodeString(encoded);
// var script = '<script type="text/javascript">' + decoded + '</script>';
// $('head').append(script);