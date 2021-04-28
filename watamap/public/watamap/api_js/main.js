"use strict";

// init
if (localStorage.WTag && localStorage.WTag >= 0) { localStorage.WTag++ } else { localStorage.WTag = 0 };
if (localStorage.WStep) { delete localStorage.WStep };

// !
let appRoot = "watamap/";

// curV for refreshing scripts (change it to "" to remove it)
let curV = "?v=" + localStorage.WTag + "_" + new Date().getSeconds();

// activation des console.log
let Wlog = true;

// for some crash report that still need refresh (F5)
let WClearTrahsOnError = true;
let IamBroken = false;

// configuration stuff
let WataConf = Object;
let WataConfThree = Object;
let WataThreeLibrarie = Object;

window.onload = function WatamapStarter(e) {
    if (Wlog) { console.log('Watamap Mounted...'); }
    // get config json file before anything else
    if (!WataConf.Appy) {
        if (Wlog) console.log('demande config_main');
        getJsonConfig(appRoot + "api_js/json/config_main.json");
    } else {
        if (Wlog) console.log('Config config_main existe deja !');
        stepCheck();
    }
}

function getActionRouter(query) {
    console.log(WataConf.Appy.apiUrl);
    if (query) {
        getJson(
            WataConf.Appy.apiUrl,
            JSON.stringify(query),
            (datas) => {
                // if(Wlog) console.log('datas.length reçus :' + datas.length + ' pour: "' + query['action'] + '" de type "' + typeof datas)
                // if(Wlog) console.log(datas)
                switch (query['action']) {
                    case 'getHtmlBoardDatas':
                        getHtmlBoardDatas(ResponsetoJson(datas))
                        break;
                    case 'getAliveUsers':
                        getAliveUsers(ResponsetoJson(datas))
                        break;
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
                        startActionLoggin(ResponsetoJson(datas))
                        break;
                    default:
                        if (Wlog) console.log(`Dsl, mais nous n'avons plus de "${query['action']}" en stock .`);
                        break;
                }
            });
    }
}
// ----------------------------------------------------------------
function ResponsetoJson(string) {
    if (string) {
        if (JSON.parse(string)[0] === true) {
            let jssondata = JSON.parse(string)
            return jssondata
        } else if (JSON.parse(string)[1]) {
            if (Wlog) console.log(JSON.parse(string)[1])
            if (WClearTrahsOnError) { unSetMePlease(); }
            return false
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
            if (Wlog) console.log('Soudain un problème !!')
                // } else if (xhr.readyState === 2 && xhr.status == 200) {
                //     // if(Wlog) console.log('Demande en cours ...')
                // } else if (xhr.readyState === 3 && xhr.status == 200) {
                //     // if(Wlog) console.log('Ne quittez pas !')
        } else if (xhr.readyState > 3 && xhr.status == 200) {
            // if(Wlog) console.log('Paquet livré ! (' + typeof xhr.responseText + '/' + xhr.responseText.length + ')')
            success(xhr.responseText);
        }
    };
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("data=" + para);
    return xhr;
}
// ----------------------------------------------------------------
function getJsonConfig(jsonfile) {
    lectureJsonAjax(jsonfile + curV, function setWataConf(textjson) {
        if (Wlog) console.log('Config A reçus !');
        WataConf = JSON.parse(textjson);
        // if(Wlog) console.log('WataConf stored...');
        if (WataConf.Appy) {
            // check conf and profil for proccesing to loggin or scene
            stepCheck();
        } else {
            if (WClearTrahsOnError) { unSetMePlease(); }
            if (Wlog) console.log('erreur de config !');
            // ROAD END
        }
    });
}

function getJsonConfigThree(jsonfile) {
    lectureJsonAjax(jsonfile + curV, function setWataConfThree(textjson) {
        if (Wlog) console.log('Config Three reçus !');
        WataConfThree = JSON.parse(textjson);
        if (Wlog) console.log(WataConfThree);

        if (WataConfThree.scene) {
            if (Wlog) console.log('Scene three');
            addNewcss([{ "url": "assets/css/scene.css", "id": "scene-css" }]);
            addScriptBy('ByTagName', 'body', { "url": "api_js/scene.js", "id": "scene-js" })
        } else {
            if (Wlog) console.log('erreur de config Three !');
            if (WClearTrahsOnError) { unSetMePlease(); }
        }
    });
}

function getJsonThreeLibrarie(jsonfile) {
    lectureJsonAjax(jsonfile + curV, function setWataThreeLibrarie(textjson) {
        if (Wlog) console.log('Config Three reçus !');
        WataThreeLibrarie = JSON.parse(textjson);
        if (WataThreeLibrarie) {



            if (Wlog) console.log(WataThreeLibrarie);
        } else {
            if (Wlog) console.log('erreur de config Three !');
            if (WClearTrahsOnError) { unSetMePlease(); }
        }
    });
}
// ----------------------------------------------------------------
function stepCheck() {
    // check conf and profil for proccesing to loggin or scene
    if ((sessionStorage.Wtoken && sessionStorage.Wtoken != '') &&
        (sessionStorage.WuserEmail && sessionStorage.WuserEmail != '') &&
        (WataConf.Appy)) {
        // if(Wlog) console.log("Log Ok et Config Ok");
        mountScene();
    } else {
        if (Wlog) console.log("not logged -> mounting loging form");
        mountLogging();
    }
}

function addHtmlDashboard(datas) {
    // hydrate dashboard
    let boardTarget = 'dashboard';
    if (datas[1] && JSON.parse(datas[1])[0].htmlitems) {

        let htlmactions = JSON.parse(datas[1])[0].htmlitems;
        if (Wlog) { console.log(htlmactions); }


        addDomElement('ElementById', WataConf.DomTargetId, 'div', 'Wdashboard', false);
        addDomElement('ElementById', 'Wdashboard', 'ul', 'Wtools', false);
        Object.keys(htlmactions).forEach((key) => {

            addDomElement('ElementById', 'Wtools', 'li', "ww" + key, false);

            addDomElement(
                'ElementById',
                "ww" + key,
                'a',
                "www" + key, [
                    htlmactions[key]['content'],
                    htlmactions[key]['title'],
                    htlmactions[key]['href'],
                    htlmactions[key]['target'],
                    htlmactions[key]['onclick']
                ]
            );
        });
        // if (Wlog) { console.log(JSON.parse(datas[1])[0].htmlitems);}
        let thistest = document.getElementById(WataConf.DomTargetId)

    }

}

function mountScene() {
    getJsonConfigThree(appRoot + 'api_js/json/config_scene.json');
}

function mountLogging() {
    addscriptstobody('api_js/login.js', 'login-js')
        .then(() => {
            addNewcss([{ "url": "assets/css/login.css", "id": "login-css" }]);
            if (Wlog) console.log('script login mounted')
        })
        .catch(() => {
            console.error("Hum ! Là, y'a un problème a régler");
            // ROAD END
        });
}

function unmountLogging() {
    document.getElementById(WataConf.ConnectingDivId).remove()
    document.getElementById('login-css').remove()
    document.getElementById('login-js').remove()
    mountScene()

    // container.prepend(renderer.domElement);
}

function startActionLoggin(profildatas) {
    if (Wlog) console.log(profildatas)
    if (profildatas) {
        if (profildatas[0] === true) {
            if (Wlog) console.log('Vous êtes connecté(é) ! Votre profil est stocké en session !');
            if (Wlog) console.log(JSON.parse(profildatas[1])[0]);
            WataConf.DefLoging.login = document.getElementById('datalogin').value
            addStorage('session', profildatas)
                // addStorage('session',WataConf)
            unmountLogging()
        } else {
            if (Wlog) console.log('Connecting people: erreur émise par le serveur !')
        }
    } else {
        if (Wlog) console.log('Vide ??? ou inconnue !')
    }
}

// add sessionStorage||localStorage
function addStorage(type, datas) {
    datas = JSON.parse(datas[1])[0];
    Object.keys(datas).forEach((key) => {
        type === 'local' ?
            localStorage["W" + key] = datas[key] :
            sessionStorage["W" + key] = datas[key];
    });
}
// function addlocaStorage(datas) {
//     datas = JSON.parse(datas[1])[0];
//     Object.keys(datas).forEach((key) => {
//         localStorage["W" + key] = datas[key];
//     });
// }
// function addsessionStorage(datas) {
//     datas = JSON.parse(datas[1])[0];
//     Object.keys(datas).forEach((key) => {
//         sessionStorage["W" + key] = datas[key];
//     });
// }

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
    // if(Wlog) console.log(document.getElementById(targetname).parentElement)
    // addDomElement('ElementById', WataConf.DomTargetId, 'div')
    var newelement = document.createElement(elementtype)
    if (identity != false) { newelement.id = identity }
    if (elementtype === 'a') {
        if (elemdatas[0]) { newelement.textContent = elemdatas[0]; }
        if (elemdatas[1]) { newelement.title = elemdatas[1]; }
        if (elemdatas[2]) { newelement.href = elemdatas[2]; }
        if (elemdatas[2]) { newelement.target = elemdatas[3]; }
        if (elemdatas[4]) { newelement.setAttribute('onclick', elemdatas[4]); }


    } else {
        if (elemdatas.length > 0) { newelement.textContent = elemdatas[0] }
        if (elemdatas.length > 1) {
            if (elemdatas[1]) { newelement.value = elemdatas[1] }
        }

    }
    // si la demande concerne la création de la div connectiong pour le login
    // si WataConf.ConnectingDivIsFullScreen est réglé sur true dans le json
    if (getElementsBytype === WataConf.ConnectingDivId) {
        if (WataConf.ConnectingDivIsFullScreen) {
            elemdatas.classList.add('absolutefullscreen');
        }
    }
    if (Wlog) { console.log('targetname:' + targetname + ' <- on y met <-' + identity) }
    if (getElementsBytype === 'ElementsByTagName') { document.getElementsByTagName(targetname)[0].appendChild(newelement) } // multiple possible !!!!!!
    else if (getElementsBytype === 'ElementByIdParent') { document.getElementById(targetname).parentElement.appendChild(newelement) } // only the One Id
    else if (getElementsBytype === 'ElementById') { document.getElementById(targetname).appendChild(newelement) } // only the One Id
}

// function addContentToElement(targetname, textcontent) {
//     var newelement = document.createElement('p');
//     newelement.textContent = textcontent;
//     document.getElementById(targetname).appendChild(newelement);
// }

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

// function clog(datas = false) {
//     if (WataConf.FConsole.active && datas) {
//         WataConf.FConsole.count++
//             if(Wlog) console.log(datas)
//     }
// }


// $.getScript('base64.js');
// var encoded = "YWxlcnQoImhpIik7DQo="; //More text
// var decoded = decodeString(encoded);
// var script = '<script type="text/javascript">' + decoded + '</script>';
// $('head').append(script);




// definition
function addscriptstobody(scriptUrl, identity) {
    //https://stackoverflow.com/questions/14644558/call-javascript-function-after-script-is-loaded/42556752
    const script = document.createElement('script');
    script.type = "text/javascript"
    script.src = appRoot + scriptUrl + curV
    script.id = identity
    document.body.appendChild(script);
    return new Promise((res, rej) => {
        script.onload = function() {
            res();
        }
        script.onerror = function() {
            rej();
        }
    });
}


// // addscriptstobottom([{ "url": "api_js/scene.js", "id": "scene-js" }]);
// function addscriptstobottom(scripts = false) {
//     for (let i = 0; i < scripts.length; i++) {
//         if (!document.getElementById(scripts[i].id)) {
//             addScriptBy('ByTagName', 'body', scripts[i])
//         }
//     }
// }

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

//tools
function unSetMePlease() {
    if (Wlog) { console.log('unSetMePlease'); }
    // localStorage.removeItem("Wtag");
    sessionStorage.removeItem("WuserEmail");
    sessionStorage.removeItem("Wuserip");
    sessionStorage.removeItem("Wtoken");
    sessionStorage.removeItem("WuserEmail");
    sessionStorage.removeItem("Wlastconnect");
    sessionStorage.removeItem("Wx");
    sessionStorage.removeItem("Wy");
    sessionStorage.removeItem("Wz");
    sessionStorage.removeItem("WuserStatus");
    IamBroken = true;
}

function setLog() {
    if (Wlog) {
        Wlog = false;
    } else {
        Wlog = true;
        console.log('log:ON');
    }
}