
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

if(window.indexedDB){
    console.log('IndexedDB palaikomas');
}


//tikrinama kokie laikai ta diena yra laisvi
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
        console.log("prisijungta")
        db = e.target.result;
        let tran = db.transaction( ["info"], "readwrite" );
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


//Gautu duomenu surinkimas ir pateikimas IndexerDB
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
    let request = window.indexedDB.open("Infodb", 1);
    
    request.onerror = function(e) {
            console.log("Klaida: " + e.target.error);
    };
    
    request.onupgradeneeded = function(e) {
        db = e.target.result;
        let infotb = db.createObjectStore("info", { autoIncrement : true });
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
                        alert("Jūs jau esate užsiregitravę pas kirpėją");
                        
                    }else{
                        objektas.add(paketas);
                        alert('Jūs sėkmingai užsiregistravote')
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


