"use strict";
if (Wlog) { console.log("Login:" + WataConf.Appy.Name); }
// displaying login form
addDomElement('ElementByIdParent', WataConf.DomTargetId, 'div', WataConf.ConnectingDivId, false);

addDomElement('ElementById', WataConf.ConnectingDivId, 'div', 'wataform', false);
addDomElement('ElementById', 'wataform', 'H1', 't1', [WataConf.Dico.login.txt[0]]);
addDomElement('ElementById', 'wataform', 'H2', 't2', [WataConf.Dico.login.txt[1]]);
addImputElement('input', "wataform", "datalogin", 'text', false, (sessionStorage.Email ? myStorage.Email : WataConf.DefLoging.login));
addImputElement('input', "wataform", "datapassword", 'password', false, '');
addImputElement('input', "wataform", "buttonlogin", 'button', false, 'Give a try !');

document.getElementById('buttonlogin').addEventListener('click', (e) => {
    manageloginpasswordform();
})

document.getElementById('datalogin').placeholder = WataConf.Dico.login.placeholder[0];
document.getElementById('datapassword').placeholder = WataConf.Dico.login.placeholder[1];

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
        getActionRouter({ action: 'startActionLoggin', login: datlogin, password: datpassword })
    } else {
        if (Wlog) console.log("manque d'info")
    }
}