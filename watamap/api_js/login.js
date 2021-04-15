"use strict";
console.log("Appy.Name:" + WataConf.Appy.Name)
addDomElement('DomIdParent', WataConf.DomTargetId, 'div', WataConf.DefLoging.logindivid)
addDomElement('DomId', WataConf.DefLoging.logindivid, 'form', 'wataform')
addImputElement('input', "wataform", "datalogin", 'text', true, WataConf.DefLoging.login)
addImputElement('input', "wataform", "datapassword", 'password', true, WataConf.DefLoging.password)
addImputElement('input', "wataform", "buttonlogin", 'button', false, 'Give a try !')

document.getElementById('buttonlogin').addEventListener('click', (e) => {
    manageloginpasswordform()
})

function manageloginpasswordform() {
    let datlogin = document.getElementById('datalogin').value
    let datpassword = document.getElementById('datapassword').value
    let logok = datlogin.length > 0 && datlogin.length < 25 && datpassword.length > 3 && datpassword.length < 32 ? true : false
        // pas plus de test de sécu pour l'instant
    if (logok) {
        // addScriptBy('TagName', 'head', WataConf.LoginJs[0])
        getJsonDatas({ action: 'tryGetLogued', login: datlogin, password: datpassword })
    }
    console.log('logging: ' + ((logok) ? 'ok' : 'Ko !'))
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


function addDomElement(getElementsBytype, targetname, elementtype, identity) {
    // console.log(document.getElementById(targetname).parentElement)
    // addDomElement('DomId', WataConf.DomTargetId, 'div')
    var newelement = document.createElement(elementtype)
    newelement.id = identity
    if (getElementsBytype === 'TagName') { document.getElementsByTagName(targetname)[0].appendChild(newelement) } // multiple possible !!!!!!
    else if (getElementsBytype === 'DomIdParent') { document.getElementById(targetname).parentElement.appendChild(newelement) } // only the One Id
    else if (getElementsBytype === 'DomId') { document.getElementById(targetname).appendChild(newelement) } // only the One Id
}