window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;


//prideti uzsakyma
let prideti = document.getElementById('pridetiPop');
let btn = document.getElementById("prideti");
let span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    prideti.style.display = "block";
  }

span.onclick = function() {
    prideti.style.display = "none";
  }

  document.onclick = function(event) {
    if (event.target == prideti) {
        prideti.style.display = "none";
    }
  }

  function laisviLaikai() {
    let tikrinamaData = document.getElementById("datepicker").value;
    console.log("Gaunama data is lauko " + tikrinamaData);

   

    //Pasalina pazymetus laikus jei buvo pazymeti
    let pazLaik = document.querySelectorAll(".pas-laikas");
    let spalLaik = document.getElementsByClassName("select")
    for (let b = 0; b < pazLaik.length; b++) {
        pazLaik[b].disabled = false;
        spalLaik[b].classList = "select checkBgOff";
    }

    let db;
    let request = window.indexedDB.open("Infodb", 1);
    request.onupgradeneeded = function(e) {
        db = e.target.result;
        let infotb = db.createObjectStore("info", { autoIncrement : true });
    };
    
    request.onerror = function(e) {
            console.log("Klaida: " + e.target.error);
    };

    //Pazymi laikus kurie yra uzimti
    request.onsuccess = function (e) {
        db = e.target.result;
        let tran = db.transaction(["info"], "readwrite");
        let objektas = tran.objectStore("info");
        let ats = objektas.getAll();

        ats.onsuccess = function(){
            let atsakymas = ats.result;
            for (let a = 0; a < atsakymas.length; a++){
                if (tikrinamaData === atsakymas[a].data){
                    let banLaikas = atsakymas[a].laikas;
                    let blLaikas = document.getElementById(banLaikas);
                    blLaikas.disabled = true;
                    let inactive = document.getElementById(banLaikas+"-2");
                    inactive.classList = "select checkBgOn";
                    console.log("loop " + atsakymas[a].data)
               }
            }

        }

        tran.oncomplete = function(e) {
           console.log("baigta");
      };
    }
}

  function getData() {
    let manoData = document.getElementById("datepicker").value;
    console.log(manoData);
    let manoLaikas = document.querySelector('input[name="pas-laikas"]:checked').id;
    console.log(manoLaikas);
    let manoVardas = document.getElementById("vardas").value;
    console.log(manoVardas);
    let manoTelefonas = document.getElementById("telefonas").value;
    console.log(manoTelefonas);
    let manoPaslaugaRaw = document.querySelectorAll('input[name="paslauga"]:checked');
    let manoPaslauga = [];
    for (let i = 0; i < manoPaslaugaRaw.length; i++) {
        manoPaslauga.push(manoPaslaugaRaw[i].id);
    }
    console.log(manoPaslauga);

    let paketas = {
                    "data": manoData,
                    "laikas": manoLaikas,
                    "vardas": manoVardas,
                    "telefonas": manoTelefonas,
                    "paslauga": manoPaslauga
                    }

    let db;
    let request = window.indexedDB.open("InfoDB", 1);
    
    request.onerror = function(e) {
            console.log("Klaida: " + e.target.error);
    };
    
    request.onupgradeneeded = function(e) {
        db = e.target.result;
        let infoTB = db.createObjectStore("info", { autoIncrement : true });
    };

    request.onsuccess = function (e) {
        db = e.target.result;
        let tran = db.transaction(["info"], "readwrite");
        let objektas = tran.objectStore("info");

        //tikrinama ar toks vartotojas egzistuoja
        let ats = objektas.getAll();

        ats.onsuccess = function() {

            let atsakymas = ats.result;
            console.log(atsakymas.length)
            if (atsakymas.length === 0){
                objektas.add(paketas)
                alert('Jūs sėkmingai užsiregistravote')
            } else {
                for (let c = 0; c < atsakymas.length; c++){
                    if(manoTelefonas === atsakymas[c].telefonas){
                        alert("Klientas jau yra užregistruostas");
                        
                    }else{
                        objektas.add(paketas);
                        alert('Klientas sėkmingai užsiregistruotas')
                    }

                    tran.oncomplete = function(e) {
                    console.log('pavyko');
                    };
                    break;
                }
            }
        }
    }
}

//Duomenu istraukimas rezervacijos sarasui
let siandiena = new Date();
let dd = siandiena.getDate();
let mm = siandiena.getMonth() + 1;
let yyyy = siandiena.getFullYear();

if (dd < 10) {
  dd = '0' + dd;
}

if (mm < 10) {
  mm = '0' + mm;
}

siandiena = yyyy + '-' + mm + '-' + dd;

let rytojus = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
let d = rytojus.getDate()
let m = rytojus.getMonth() + 1
let mmmm = rytojus.getFullYear()

if (d < 10) {
    d = '0' + d;
  }
  
  if (m < 10) {
    m = '0' + m;
  }

rytojus = mmmm + '-' + m + '-' + d;

console.log("siandienos data: " + siandiena);
console.log("rytojaus data: " + rytojus);

let db;
let request = window.indexedDB.open("Infodb", 1);
request.onupgradeneeded = function(e) {
    db = e.target.result;
    let infotb = db.createObjectStore("info", { autoIncrement : true });
};
request.onsuccess = function (e) {
    db = e.target.result;
    let tran = db.transaction(["info"], "readwrite");
    let objektas = tran.objectStore("info");
    let ats = objektas.getAll();

    ats.onsuccess = function(){
        let atsakymas = ats.result;

        let div = document.createElement('div');
        for (let e = 0; e < atsakymas.length; e++) {
            div.className = "sarasas";
            div.innerHTML += `<div class="sarasasEil"><span class="rezdata">${atsakymas[e].data}</span><span class="rezLaikas">${atsakymas[e].laikas}</span><span class="rezVardas">${atsakymas[e].vardas}</span><span class="rezTelefonas">${atsakymas[e].telefonas}</span><span class="rezPaslauga">${atsakymas[e].paslauga}</span></div>`
            sarasas.appendChild(div);
        }
        console.log(atsakymas.length)
    }
}


//Siandienos uzsakymai
function siandienaData(){
    let db;
    let request = window.indexedDB.open("InfoDB", 1);
    request.onsuccess = function (e) {
        db = e.target.result;
        let tran = db.transaction(["info"], "readwrite");
        let objektas = tran.objectStore("info");
        let ats = objektas.getAll();

        ats.onsuccess = function(){
            let atsakymas = ats.result;
            let div = document.createElement('div');
            for (let f = 0; f < atsakymas.length; f++) {
                if (siandiena === atsakymas[f].data){
                    document.getElementById("sarasas").innerHTML = "";
                    div.className = "sarasas";
                    div.innerHTML += `<div class="sarasasEil"><span class="rezdata">${atsakymas[f].data}</span><span class="rezLaikas">${atsakymas[f].laikas}</span><span class="rezVardas">${atsakymas[f].vardas}</span><span class="rezTelefonas">${atsakymas[f].telefonas}</span><span class="rezPaslauga">${atsakymas[f].paslauga}</span></div>`
                    sarasas.appendChild(div);
                }else {
                    document.getElementById("sarasas").innerHTML = "";
                    div.className = "sarasas";
                    div.innerHTML = `<div>Šiandiena užsakymų neturite</div>`
                    sarasas.appendChild(div);
                    break;
                }   
            }
        }

    }
}


//Rytojaus uzsakymai
function rytojusData(){
    let db;
    let request = window.indexedDB.open("InfoDB", 1);
    request.onsuccess = function (e) {
        db = e.target.result;
        let tran = db.transaction(["info"], "readwrite");
        let objektas = tran.objectStore("info");
        let ats = objektas.getAll();

        ats.onsuccess = function(){
            let atsakymas = ats.result;
            let div = document.createElement('div');
            for (let f = 0; f < atsakymas.length; f++) {
                if (rytojus === atsakymas[f].data){
                    document.getElementById("sarasas").innerHTML = "";
                    div.className = "sarasas";
                    div.innerHTML += `<div class="sarasasEil"><span class="rezdata">${atsakymas[f].data}</span><span class="rezLaikas">${atsakymas[f].laikas}</span><span class="rezVardas">${atsakymas[f].vardas}</span><span class="rezTelefonas">${atsakymas[f].telefonas}</span><span class="rezPaslauga">${atsakymas[f].paslauga}</span></div>`
                    sarasas.appendChild(div);
                }else {
                    document.getElementById("sarasas").innerHTML = "";
                    div.className = "sarasas";
                    div.innerHTML = `<div>Rytoj užsakymų neturite</div>`
                    sarasas.appendChild(div);
                    break;
                }   
            }
        }

    }
}


//Rodomi visi uzsakymai
function visiUzsakymai(){
    let db;
    let request = window.indexedDB.open("InfoDB", 1);
    request.onsuccess = function (e) {
        db = e.target.result;
        let tran = db.transaction(["info"], "readwrite");
        let objektas = tran.objectStore("info");
        let ats = objektas.getAll();

        ats.onsuccess = function(){
            let atsakymas = ats.result;

            let div = document.createElement('div');
            for (let e = 0; e < atsakymas.length; e++) {
                document.getElementById("sarasas").innerHTML = "";
                div.className = "sarasas";
                div.innerHTML += `<div class="sarasasEil"><span class="rezdata">${atsakymas[e].data}</span><span class="rezLaikas">${atsakymas[e].laikas}</span><span class="rezVardas">${atsakymas[e].vardas}</span><span class="rezTelefonas">${atsakymas[e].telefonas}</span><span class="rezPaslauga">${atsakymas[e].paslauga}</span></div>`
                sarasas.appendChild(div);
            }
            console.log(atsakymas.length)
        }

        tran.oncomplete = function(e) {
            console.log("baigta");
        };
    }
}


