"use strict";
console.log("Appy.Name:" + WataConf.Appy.Name)
    // displaying login form
addDomElement('ElementByIdParent', WataConf.DomTargetId, 'div', WataConf.ConnectingDivId, false)

addDomElement('ElementById', WataConf.ConnectingDivId, 'div', 'wataform', false)
addDomElement('ElementById', 'wataform', 'H1', 't1', [WataConf.Dico.login.txt[0]])
addDomElement('ElementById', 'wataform', 'H2', 't2', [WataConf.Dico.login.txt[1]])
addImputElement('input', "wataform", "datalogin", 'text', false, (sessionStorage.Email ? myStorage.Email : WataConf.DefLoging.login))
addImputElement('input', "wataform", "datapassword", 'password', false, WataConf.DefLoging.password)
addImputElement('input', "wataform", "buttonlogin", 'button', false, 'Give a try !')

document.getElementById('buttonlogin').addEventListener('click', (e) => {
    manageloginpasswordform()
})

document.getElementById('datalogin').placeholder = WataConf.Dico.login.placeholder[0]
document.getElementById('datapassword').placeholder = WataConf.Dico.login.placeholder[1]

document.getElementById('buttonlogin').addEventListener('onblur', (e) => {
    e.target.placeholder = WataConf.Dico.login.placeholder[0]
})
document.getElementById('datapassword').addEventListener('onblur', (e) => {
    e.target.placeholder = WataConf.Dico.login.placeholder[1]
})
document.getElementById('buttonlogin').addEventListener('onfocus', (e) => {
    e.target.placeholder = WataConf.Dico.login.placeholder[2] // bug ???
})
document.getElementById('datapassword').addEventListener('onfocus', (e) => {
    e.target.placeholder = WataConf.Dico.login.placeholder[2] // bug ???
})



function manageloginpasswordform() {
    let datlogin = document.getElementById('datalogin').value
    let datpassword = document.getElementById('datapassword').value
    let logok = datlogin.length > 0 && datlogin.length < 25 && datpassword.length > 3 && datpassword.length < 32 ? true : false

    // pas plus de test de sécu pour l'instant
    if (logok) {
        localStorage.watamapUser = datlogin
        getJsonDatas({ action: 'tryGetLogued', login: datlogin, password: datpassword })
    } else {
        console.log("manque d'info")
    }
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
    newelement.id = identity
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