const object = {
    Januar: 1,
    Februar: 2,
    Mart: 3,
    April: 4,
    Maj: 5,
    Juni: 6,
    Juli: 7,
    Avgust: 8,
    Septembar: 9,
    Oktobar: 10,
    Novembar: 11,
    Decembar: 12
}

var nizUcitanihSlika=[];
var duzinaNiza=100;

var Pozivi = (function(){
    var ajax = new XMLHttpRequest();
    function ucitavanje(){
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 404){
                console.log(ajax.status);
                }
            else if (ajax.readyState == 4 && ajax.status == 200){
                let re = JSON.parse(ajax.responseText);
                let periodicna=re.periodicna;
                let vanredna=re.vanredna;
                Kalendar.ucitajPodatke(periodicna, vanredna);
            }
        }
        ajax.open("GET", "http://localhost:8080/zauzeca", true);
        ajax.send();
    }

    function ucitajSlike(pocetak){
        if(!pocetak)document.getElementsByClassName("dugme1")[0].disabled=false;

        let ind=0;
        for(let n=0;n<nizUcitanihSlika.length;n++){
            if((document.getElementById("slika3").src)==nizUcitanihSlika[n])ind=n;
        }
        //provjeravamo da li trebamo sa servera ucitavati slike ili su vec ucitane
        if(nizUcitanihSlika.length==0 || ind==nizUcitanihSlika.length-1){

        if(pocetak==true)nizUcitanihSlika=[];
        ajax=new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            var t=document.getElementById("slika1");
            var z=document.getElementById("slika2");
            var o=document.getElementById("slika3");

            if (ajax.readyState == 4 && ajax.status == 404){
                console.log(ajax.status);
                }
            else if (ajax.readyState == 4 && ajax.status == 200){
            let re = JSON.parse(ajax.responseText);
            duzinaNiza=re.duzinaFajla;
            //vracene slike sa servera stavljamo na stranicu
            if(re.noviNiz.length==1){
                t.src=re.noviNiz[0];
                z.src="#";
                o.src="#";
                document.getElementById("slika2").style.visibility = "hidden";
            document.getElementById("slika3").style.visibility = "hidden";
                nizUcitanihSlika.push(re.noviNiz[0]);
            }
            else if(re.noviNiz.length==2){
                t.src=re.noviNiz[0];
                z.src=re.noviNiz[1];
                o.src="#";
                document.getElementById("slika3").style.visibility = "hidden";
                nizUcitanihSlika.push(re.noviNiz[0]);
                nizUcitanihSlika.push(re.noviNiz[1]);
            }
             else{
             t.src=re.noviNiz[0];
             nizUcitanihSlika.push(re.noviNiz[0]);
             z.src=re.noviNiz[1];
             nizUcitanihSlika.push(re.noviNiz[1]);
             o.src=re.noviNiz[2];
             nizUcitanihSlika.push(re.noviNiz[2]);
            }
             if(re.kraj==true)document.getElementsByClassName("dugme2")[0].disabled=true;
            }
        }
    
        ajax.open("POST", "http://localhost:8080/slika1", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({pocetak}));
    }
    //kad se ne ucitavaju sa servera
    else{
        ind+=3;
        //provjera da li se prikazuje zadnja slika u folderu
        if(nizUcitanihSlika.length==duzinaNiza){
            if(document.getElementById("slika1").src==nizUcitanihSlika[nizUcitanihSlika.length-4] || document.getElementById("slika2").src==nizUcitanihSlika[nizUcitanihSlika.length-4] || document.getElementById("slika3").src==nizUcitanihSlika[nizUcitanihSlika.length-4])document.getElementsByClassName("dugme2")[0].disabled=true;
        }

        //provjera da li se na zadnjem "slajdu" prikazuju jedna dvije ili 3 slike
        if(document.getElementById("slika1").src==nizUcitanihSlika[nizUcitanihSlika.length-4] && duzinaNiza%3==1){
            document.getElementById("slika1").src=nizUcitanihSlika[ind-2];
            document.getElementById("slika2").style.visibility = "hidden";
            document.getElementById("slika3").style.visibility = "hidden";
            
        }

        else if(document.getElementById("slika2").src==nizUcitanihSlika[nizUcitanihSlika.length-4] && duzinaNiza%3==2){
            document.getElementById("slika1").src=nizUcitanihSlika[ind-2];
            document.getElementById("slika2").src=nizUcitanihSlika[ind-1];
            document.getElementById("slika3").style.visibility = "hidden";
            
        }

        else{
            document.getElementById("slika2").style.visibility = "visible";
            document.getElementById("slika3").style.visibility = "visible";
        document.getElementById("slika1").src=nizUcitanihSlika[ind-2];
        document.getElementById("slika2").src=nizUcitanihSlika[ind-1];
        document.getElementById("slika3").src=nizUcitanihSlika[ind];
        }

    }
    
    }
 

    function kliknuto(event){
        let trenutniDan=event.getElementsByClassName("gore")[0].innerHTML;
        if(trenutniDan.length==1)trenutniDan="0"+trenutniDan;
        let trenutniMjesec=document.getElementById("nazivMjeseca").innerHTML;
        trenutniMjesec = object[trenutniMjesec];
        let datum = (trenutniDan + "." + ("0"+(trenutniMjesec)).slice(-2) + "." +"2019"); //datum za zauzeća.json
        let datum2 = (trenutniDan + "/" + ("0"+(trenutniMjesec)).slice(-2) + "/" +"2019"); //datum za alert
        let dan = new Date(2019, trenutniMjesec-1,trenutniDan);
        dan=dan.getDay()-1;
        if(dan==-1)dan=6;
        let sala = document.getElementById("sale").value;
        let pocetak = document.getElementById("pocetak").value;
        let kraj = document.getElementById("kraj").value;
        let provjera=event.getElementsByClassName("slobodna");
        let semestar="";
        if(trenutniMjesec==1 || trenutniMjesec==11 || trenutniMjesec==10 || trenutniMjesec==12)semestar="zimski";
        if(trenutniMjesec==2 || trenutniMjesec==3 || trenutniMjesec==4 || trenutniMjesec==5 || trenutniMjesec==6)semestar="ljetni";
        if(provjera.length!=0){
        if(document.getElementById("periodicna").checked==false){
        let r=confirm("Da li zelite rezervisati?");
        if(r==true){
                if(pocetak=="" || kraj==""){

                    let a=alert("Niste upisali datum pocetka ili kraja");
                }
                else{
                    ajax=new XMLHttpRequest();
                    ajax.onreadystatechange = function(){
                        if (ajax.readyState == 4 && ajax.status == 404){
                            let h=alert("Nije moguće rezervisati salu "+sala+" za navedeni datum " +datum2+ " i termin od " +pocetak+" do "+kraj);
                        }
                        else if (ajax.readyState == 4 && ajax.status == 200){
                        const perr=JSON.parse(ajax.responseText);
                        if(perr.zauzeto==true){
                            let obavjest=alert("Nije moguće rezervisati salu "+sala+" za navedeni datum " +datum2+ " i termin od " +pocetak+" do "+kraj);
                        }
                        Kalendar.ucitajPodatke(perr.dataa.periodicna,perr.dataa.vanredna);
                         }
                    }
                    let varijabla={
                        datum, 
                        sala,
                        pocetak,
                        kraj
                    };
                    ajax.open("POST", "http://localhost:8080/zauzeca",true);
                    ajax.setRequestHeader("Content-Type", "application/json");
                    ajax.send(JSON.stringify(varijabla));
                }
            }
               
        }
        else{
            if(semestar==""){
                let h=alert("Nije moguće rezervisati salu "+sala+" za navedeni datum " +datum2+ " i termin od " +pocetak+" do "+kraj);
            }
            else{
            let r=confirm("Da li zelite rezervisati?");
        if(r==true){

            
                if(pocetak=="" || kraj==""){

                    let a=alert("Niste upisali datum pocetka ili kraja");
                }
                else{
                    ajax=new XMLHttpRequest();
                    ajax.onreadystatechange = function(){
                        if (ajax.readyState == 4 && ajax.status == 404){
                            let h=alert("Nije moguće rezervisati salu "+sala+" za navedeni datum " +datum2+ " i termin od " +pocetak+" do "+kraj);
                        }
                        else if (ajax.readyState == 4 && ajax.status == 200){
                            const perr=JSON.parse(ajax.responseText);
                            if(perr.zauzeto==true){
                                let obavjest=alert("Nije moguće rezervisati salu "+sala+" za navedeni datum " +datum2+ " i termin od " +pocetak+" do "+kraj);
                            }
                            Kalendar.ucitajPodatke(perr.dataa.periodicna,perr.dataa.vanredna);
                             }
                    }
                    let varijabla={
                        dan,
                        semestar, 
                        sala,
                        pocetak,
                        kraj
                    };
                    ajax.open("POST", "http://localhost:8080/zauzeca1",true);
                    ajax.setRequestHeader("Content-Type", "application/json");
                    ajax.send(JSON.stringify(varijabla));
                }
            }
        }
        }

        }
        else{
            let h=alert("Nije moguće rezervisati salu "+sala+" za navedeni datum " +datum2+ " i termin od " +pocetak+" do "+kraj);
        }
    }

    return{
        ucitavanje: ucitavanje,
        kliknuto: kliknuto,
        ucitajSlike: ucitajSlike
    }
}());