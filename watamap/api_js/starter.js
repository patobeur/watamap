"use strict";
if (localStorage.WTag && localStorage.WTag >= 0) { localStorage.WTag++ } else { localStorage.WTag = 0 }
if (localStorage.WStep) { delete localStorage.WStep }
let appRoot = "watamap/"
let curV = "?v=" + localStorage.WTag + "_" + new Date().getSeconds()
let WataConf = []

window.onload = function WatamapStarter(e) {
    // get config json file before anything else
    // console.log(sessionStorage.WtF)
    if (!WataConf.Appy) {
        console.log('demande config A');
        getJsonConfig(appRoot + "api_js/watamap.json");
    } else {
        console.log('Config A deja reçus !')
        stepCheck()
    }
}

function getJsonConfig(jsonfile) {
    lectureJsonAjax(jsonfile + curV, function setWataConf(textjson) {
        console.log('Config A reçus !')
        WataConf = JSON.parse(textjson)
        sessionStorage.WCont
        if (WataConf.Appy) {
            stepCheck()
        } else { console.log('erreur de config !') }
    });
}

function getJsonConfigThree(jsonfile) {
    lectureJsonAjax(jsonfile + curV, function setWataConf(textjson) {
        console.log('Config reçus !')
        WataConf = JSON.parse(textjson)
        if (WataConf) {
            console.log('Fichier Config OK , (WataConf=config.json)')
            stepCheck()
        } else { console.log('erreur de config !') }
    });
}

function stepCheck() {
    addNewcss([{ "url": "assets/css/watamap.css", "id": "watamap-css" }]);
    if ((sessionStorage.Wtoken && sessionStorage.Wtoken != '') &&
        (sessionStorage.WuserEmail && sessionStorage.WuserEmail != '') &&
        (WataConf.Appy)
        // (sessionStorage.WataConf && sessionStorage.WataConf != '') &&
    ) {
        console.log("Log Ok et Config Ok")
        mountScene()

    } else {
        console.log("Log Ko")
        mountLogging()
    }
}


function mountScene() {
    if (sessionStorage.Wtoken) {
        console.log('Scene three')
        addscriptstobottom([{ "url": "api_js/scene.js", "id": "login-js" }])
    }
}

function mountLogging() {
    addscriptstobottom([{ "url": "api_js/login.js", "id": "login-js" }])
}

function unmountLogging() {
    document.getElementById(WataConf.ConnectingDivId).remove()
    document.getElementById('login-js').remove()
    mountScene()
}

function startActionLoggin(profildatas) {
    console.log(profildatas)
    if (profildatas) {
        if (profildatas[0] === true) {
            console.log('Vous êtes connecté(é) !')
            console.log('mail stocké !')
            console.log(JSON.parse(profildatas[1])[0])
            WataConf.DefLoging.login = document.getElementById('datalogin').value
                // localStorage.Email = document.getElementById('datalogin').value
            localStorage.WUser = JSON.parse(profildatas[1])[0]['userEmail']
            localStorage.WToken = JSON.parse(profildatas[1])[0]['token']
            addsessionStorage(profildatas)
                // addsessionStorage(WataConf)
            unmountLogging()
        } else {
            console.log('Connecting people: erreur émise par le serveur !')
        }
    } else {
        console.log('Vide ??? ou inconnue !')
    }
}

// addSession('sessionStorage||localStorage')
function addlocaStorage(datas) {
    datas = JSON.parse(datas[1])[0];
    Object.keys(datas).forEach((key) => {
        localStorage["W" + key] = datas[key];
    });
}

function addsessionStorage(datas) {
    datas = JSON.parse(datas[1])[0];
    Object.keys(datas).forEach((key) => {
        sessionStorage["W" + key] = datas[key];
        // sessionStorage.setItem("W" + key) = datas[key]
    });
}

// <link rel="preconnect" href="https://fonts.gstatic.com">
// <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lato&display=swap">


function addScriptBy(getElementsBytype, targetname, element) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = appRoot + element.url + curV
    script.id = element.id
    if (!document.getElementById(element.id)) {
        if (getElementsBytype === 'ByTagName') { document.getElementsByTagName(targetname)[0].appendChild(script) } // multiple possible !!!!!!
        else if (getElementsBytype === 'ById') { document.getElementById(targetname).appendChild(script) } // only the One Id
    }
}

function addscriptstoheader(scripts = false) {
    for (let i = 0; i < scripts.length; i++) {
        if (!document.getElementById(scripts[i].id)) {
            addScriptBy('ByTagName', 'head', scripts[i])
        }
    } // Only Array
    // scripts.array.forEach(element => {addScriptTo('head', element)});        // Only Objects
}

// function addthisscriptstoheader() {
//     let scripts = WataConf.HeaderJs
//     for (let i = 0; i < scripts.length; i++) {
//         if (!document.getElementById(scripts[i].id)) {
//             addScriptBy('ByTagName', 'head', scripts[i])
//         }
//     } // Only Array
//     // scripts.array.forEach(element => {addScriptTo('head', element)});        // Only Objects
// }

function addscriptstobottom(scripts = false) {
    for (let i = 0; i < scripts.length; i++) {
        if (!document.getElementById(scripts[i].id)) {
            addScriptBy('ByTagName', 'body', scripts[i])
        }
    }
}

function addNewcss(csss = false) {
    for (let i = 0; i < csss.length; i++) {
        if (!document.getElementById(csss[i].id)) { addCss('ByTagName', 'head', csss[i]) }
    }
}

function addCss(getElementsBytype, targetname, element) {
    var script = document.createElement('link');
    script.type = 'text/css'
    script.href = appRoot + element.url + curV
    script.rel = "stylesheet"
    script.id = element.id
    document.getElementsByTagName(targetname)[0].appendChild(script);
}

function addImputElement(tag = false, targetname = 'body', indentity = 'unknownId', inputtype = 'text', label = false, value = false) {
    if (tag && label) {
        var newlabel = document.createElement('label')
        newlabel.for = indentity
        newlabel.textContent = indentity
        document.getElementById(targetname).appendChild(newlabel)
    }
    var newelement = document.createElement(tag)
    newelement.type = inputtype
    newelement.id = indentity
    if (value) { newelement.value = value }
    document.getElementById(targetname).appendChild(newelement)
}

function addImputButton(tag, targetname, indentity, inputtype) {
    var newelement = document.createElement(tag)
    newelement.type = 'button'
    newelement.id = indentity
    document.getElementById(targetname).appendChild(newlabel)
    document.getElementById(targetname).appendChild(newelement)
}

function addDomElement(getElementsBytype, targetname, elementtype, identity, elemdatas) {
    // console.log(document.getElementById(targetname).parentElement)
    // addDomElement('ElementById', WataConf.DomTargetId, 'div')
    var newelement = document.createElement(elementtype)
    if (identity != false) { newelement.id = identity }
    if (elemdatas.length > 0) { newelement.textContent = elemdatas[0] }
    if (elemdatas.length > 1) {
        if (elemdatas[1]) { newelement.value = elemdatas[1] }
    }
    if (getElementsBytype === WataConf.ConnectingDivId) {
        if (WataConf.ConnectingDivIsFullScreen) {
            elemdatas.classList.add('absolutefullscreen')
        }
    }
    if (getElementsBytype === 'ElementsByTagName') { document.getElementsByTagName(targetname)[0].appendChild(newelement) } // multiple possible !!!!!!
    else if (getElementsBytype === 'ElementByIdParent') { document.getElementById(targetname).parentElement.appendChild(newelement) } // only the One Id
    else if (getElementsBytype === 'ElementById') { document.getElementById(targetname).appendChild(newelement) } // only the One Id
}
// function addDomElement(getElementsBytype, targetname, elementtype, identity) {
//     // console.log(document.getElementById(targetname).parentElement)
//     // addDomElement('ById', WataConf.DomTargetId, 'div')
//     var newelement = document.createElement(elementtype)
//     newelement.id = identity
//     if (getElementsBytype === 'ByTagName') { document.getElementsByTagName(targetname)[0].appendChild(newelement) } // multiple possible !!!!!!
//     else if (getElementsBytype === 'DomIdParent') { document.getElementById(targetname).parentElement.appendChild(newelement) } // only the One Id
//     else if (getElementsBytype === 'ById') { document.getElementById(targetname).appendChild(newelement) } // only the One Id
// }

function addContentToElement(targetname, textcontent) {
    var newelement = document.createElement('p');
    newelement.textContent = textcontent
    document.getElementById(targetname).appendChild(newelement)
}

function lectureJsonAjax(file, callback) {
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
            appRoot + WataConf.Appy.apiUrl,
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
                    case 'startActionLoggin':
                        console.log(datas)
                        startActionLoggin(ResponsetoJson(datas))
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