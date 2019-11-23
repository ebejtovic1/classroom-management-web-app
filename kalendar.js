var red;
var van;

let Kalendar = (function(){
    function periodicna(dan, semestar, pocetak, kraj, naziv, predavac) {
          this.dan = dan;
          this.semestar=semestar;
          this.pocetak=pocetak;
          this.kraj=kraj;
          this.naziv=naziv;
          this.predavac=predavac;
        }
    function vanredna(datum, pocetak, kraj, naziv, predavac) {
          this.datum=datum;
          this.pocetak=pocetak;
          this.kraj=kraj;
          this.naziv=naziv;
          this.predavac=predavac;
        }

    function provjeraVremena(vrijeme){
          var provjera=/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
          return (vrijeme.length==5 &&  provjera.exec(vrijeme));
        }

    function provjeraDatuma(datum){
        var provjera=/^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/;
        return (datum.length==10 &&  provjera.exec(datum));
        }

    function daLiJePresjek(pocetak1, kraj1, pocetak2, kraj2){
        var poc1 = (parseInt(pocetak1.substring(0,2),10))*60+parseInt(pocetak1.substring(3,5),10);
        var kra1 = (parseInt(kraj1.substring(0,2),10))*60+parseInt(kraj1.substring(3,5),10);
        var poc2 = (parseInt(pocetak2.substring(0,2),10))*60+parseInt(pocetak2.substring(3,5),10);
        var kra2 = (parseInt(kraj2.substring(0,2),10))*60+parseInt(kraj2.substring(3,5),10);
        if((poc2>=poc1 && poc2<=kra1)||(kra2>=poc1 && kra2<=kra1)||(poc2<=poc1 && kra2>=kra1))return true;
        return false;
}

    function obojiZauzeca(kalendarRef, mjesec, sala, pocetak, kraj){
        Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"),mjesec);
        var p2 = parseInt(pocetak.substring(0,2),10);
        var p2min = parseInt(pocetak.substring(3,5),10);
        var k2 = parseInt(kraj.substring(0,2),10);
        var k2min = parseInt(kraj.substring(3,5),10);
        var i=0;
        for(i;i<red.length;i++){
            if(red[i].naziv==sala && (red[i].dan>=0 && red[i].dan<=6) && ((p2<k2)||(p2==k2 && p2min<k2min)))
            {
                var p1 = parseInt(red[i].pocetak.substring(0,2),10);
                var p1min = parseInt(red[i].pocetak.substring(3,5),10);
                var k1 = parseInt(red[i].kraj.substring(0,2),10);
                var k1min = parseInt(red[i].kraj.substring(3,5),10);
                if(provjeraVremena(red[i].pocetak) && provjeraVremena(red[i].kraj) && ((p1<k1)||(p1==k1 && p1min<k1min)) && daLiJePresjek(red[i].pocetak, red[i].kraj, pocetak, kraj)){
                    if(red[i].semestar=="zimski" && (mjesec==9 || mjesec==10 || mjesec==11 || mjesec==0)){
                    var varijabla=document.getElementsByClassName("treciRed");
                    varijabla=varijabla[0];
                    var novi=varijabla.getElementsByClassName("malyTabela");
                    novi=novi[red[i].dan];
                    var donji=novi.getElementsByClassName("slobodna");
                    donji[0].className="zauzeta";
                    varijabla=document.getElementsByClassName("prviRed");
                    varijabla=varijabla[0];
                    novi=varijabla.getElementsByClassName("malyTabela");
                    novi=novi[red[i].dan];
                    donji=novi.getElementsByClassName("slobodna");
                    donji[0].className="zauzeta";
                    varijabla=document.getElementsByClassName("drugiRed");
                    varijabla=varijabla[0];
                    novi=varijabla.getElementsByClassName("malyTabela");
                    novi=novi[red[i].dan];
                    donji=novi.getElementsByClassName("slobodna");
                    donji[0].className="zauzeta";
                    varijabla=document.getElementsByClassName("cetvrtiRed");
                    varijabla=varijabla[0];
                    novi=varijabla.getElementsByClassName("malyTabela");
                    novi=novi[red[i].dan];
                    donji=novi.getElementsByClassName("slobodna");
                    donji[0].className="zauzeta";
                    varijabla=document.getElementsByClassName("petiRed");
                    varijabla=varijabla[0];
                    novi=varijabla.getElementsByClassName("malyTabela");
                    novi=novi[red[i].dan];
                    donji=novi.getElementsByClassName("slobodna");
                    donji[0].className="zauzeta";
                    varijabla=document.getElementsByClassName("sestiRed");
                    varijabla=varijabla[0];
                    novi=varijabla.getElementsByClassName("malyTabela");
                    novi=novi[red[i].dan];
                    donji=novi.getElementsByClassName("slobodna");
                    donji[0].className="zauzeta";
            }
            if(red[i].semestar=="ljetni" && (mjesec==1 || mjesec==2 || mjesec==3 || mjesec==4 || mjesec==5)){
                var varijabla=document.getElementsByClassName("treciRed");
                varijabla=varijabla[0];
                var novi=varijabla.getElementsByClassName("malyTabela");
                novi=novi[red[i].dan];
                var donji=novi.getElementsByClassName("slobodna");
                donji[0].className="zauzeta";
                varijabla=document.getElementsByClassName("prviRed");
                varijabla=varijabla[0];
                novi=varijabla.getElementsByClassName("malyTabela");
                novi=novi[red[i].dan];
                donji=novi.getElementsByClassName("slobodna");
                donji[0].className="zauzeta";
                varijabla=document.getElementsByClassName("drugiRed");
                varijabla=varijabla[0];
                novi=varijabla.getElementsByClassName("malyTabela");
                novi=novi[red[i].dan];
                donji=novi.getElementsByClassName("slobodna");
                donji[0].className="zauzeta";
                varijabla=document.getElementsByClassName("cetvrtiRed");
                varijabla=varijabla[0];
                novi=varijabla.getElementsByClassName("malyTabela");
                novi=novi[red[i].dan];
                donji=novi.getElementsByClassName("slobodna");
                donji[0].className="zauzeta";
                varijabla=document.getElementsByClassName("petiRed");
                varijabla=varijabla[0];
                novi=varijabla.getElementsByClassName("malyTabela");
                novi=novi[red[i].dan];
                donji=novi.getElementsByClassName("slobodna");
                donji[0].className="zauzeta";
                varijabla=document.getElementsByClassName("sestiRed");
                varijabla=varijabla[0];
                novi=varijabla.getElementsByClassName("malyTabela");
                novi=novi[red[i].dan];
                donji=novi.getElementsByClassName("slobodna");
                donji[0].className="zauzeta";
            }
        }
    }
}

    var j=0;
    for(j;j<van.length;j++){
        if(van[j].naziv==sala && ((p2<k2)||(p2==k2 && p2min<k2min))){
            var p1 = parseInt(van[j].pocetak.substring(0,2),10);
            var p1min = parseInt(van[j].pocetak.substring(3,5),10);
            var k1 = parseInt(van[j].kraj.substring(0,2),10);
            var k1min = parseInt(van[j].kraj.substring(3,5),10);
                if(provjeraDatuma(van[j].datum) && provjeraVremena(van[j].pocetak) && provjeraVremena(van[j].kraj) && ((p1<k1)||(p1==k1 && p1min<k1min)) && daLiJePresjek(van[j].pocetak, van[j].kraj, pocetak, kraj)){
                    var mont=van[j].datum.substring(3,5);
                    var mon=parseInt(mont,10);
                    mon--;
                        if(mon==mjesec){
                        var pronadji=document.getElementsByClassName("malyTabela");
                        var e=0;
                        for(e;e<pronadji.length;e++){
                            var nova=pronadji[e].getElementsByClassName("gore");
                            var dayy=van[j].datum.substring(0,2);
                                if(dayy[0]=='0')dayy=dayy.substring(1);
                                if(nova[0].innerHTML==dayy){
                                var boja1=pronadji[e].getElementsByClassName("zauzeta");
                                    if(boja1.length==0){
                                        var boja=pronadji[e].getElementsByClassName("slobodna");
                                        boja[0].className="zauzeta";}
                }
            }
        }
    }
}
}
}
    function ucitajPodatke(periodicna, vanredna){
        var mj=0;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="Januar")mj=0;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="Februar")mj=1;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="Mart")mj=2;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="April")mj=3;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="Maj")mj=4;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="Juni")mj=5;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="Juli")mj=6;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="Avgust")mj=7;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="Septembar")mj=8;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="Oktobar")mj=9;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="Novembar")mj=10;
        if(document.getElementById("tabelaSala").rows[0].cells[0].innerHTML=="Decembar")mj=11;
        var e = document.getElementById("sale");
        var sal = e.options[e.selectedIndex].value;
        red=periodicna;
        van=vanredna;
        Kalendar.obojiZauzeca(document.getElementById("tabelaSala"),mj,sal,document.getElementById("pocetak").value,document.getElementById("kraj").value);
    }

    function daniUGodini(mjesec){
        var date = new Date();
        return 32-new Date(date.getFullYear(), mjesec, 32).getDate();
    }
    function prviDan(mjesec){
        var date = new Date();
        var dan = (new Date(date.getFullYear(), mjesec)).getDay();
        dan--;
        if(dan<0)dan+=7;
        return dan;
        }

    
    function iscrtajKalendar(kalendarRef, mjesec){
        if(mjesec>=0 && mjesec<=11){
        var d=document.getElementsByClassName("zauzeta");
        while(d.length!=0){
            d[0].className="slobodna";
        }
        var x=document.getElementById("nazivMjeseca");
        if(x!=null){
        if(mjesec==0)x.innerHTML="Januar"
        if(mjesec==1)x.innerHTML="Februar";
        if(mjesec==2)x.innerHTML="Mart";
        if(mjesec==3)x.innerHTML="April";
        if(mjesec==4)x.innerHTML="Maj";
        if(mjesec==5)x.innerHTML="Juni";
        if(mjesec==6)x.innerHTML="Juli";
        if(mjesec==7)x.innerHTML="Avgust";
        if(mjesec==8)x.innerHTML="Septembar";
        if(mjesec==9)x.innerHTML="Oktobar";
        if(mjesec==10)x.innerHTML="Novembar";
        if(mjesec==11)x.innerHTML="Decembar";
    }
        var d=document.getElementsByClassName("nevidljiva");
        while(d.length!=0){
        d[0].classList.remove("nevidljiva");
    }
        let firstDay=prviDan(mjesec);
        var j=0;
        var red=2;
        
        x = kalendarRef.getElementsByClassName("prviRed");
        x=x[0];
        for(j;j<firstDay;j++){
            if(x!=undefined)x.cells[j].classList.add("nevidljiva");
        }
        var i=firstDay;
        var duzina = daniUGodini(mjesec);
        for(i;i<duzina+firstDay;i++){
            var provjera=document.getElementsByClassName("gore")[i];
            if(provjera!=undefined)provjera.innerHTML=i-firstDay+1;
        }
        var brojac=13+firstDay+duzina;
        var brojReda=0;
        if(brojac>=42 && brojac<=48)brojReda=6;
        if(brojac>=49 && brojac<=55)brojReda=7;
        
        if(brojReda==6){
            if(document.getElementsByClassName("sestiRed")[0]!=undefined)document.getElementsByClassName("sestiRed")[0].classList.add("nevidljiva");
            if(document.getElementsByClassName("sestiRed")[1]!=undefined)document.getElementsByClassName("sestiRed")[1].classList.add("nevidljiva");
            if(document.getElementsByClassName("sestiRed")[2]!=undefined)document.getElementsByClassName("sestiRed")[2].classList.add("nevidljiva");
            if(document.getElementsByClassName("sestiRed")[3]!=undefined)document.getElementsByClassName("sestiRed")[3].classList.add("nevidljiva");
            if(document.getElementsByClassName("sestiRed")[4]!=undefined)document.getElementsByClassName("sestiRed")[4].classList.add("nevidljiva");
            if(document.getElementsByClassName("sestiRed")[5]!=undefined)document.getElementsByClassName("sestiRed")[5].classList.add("nevidljiva");
            if(document.getElementsByClassName("sestiRed")[6]!=undefined)document.getElementsByClassName("sestiRed")[6].classList.add("nevidljiva");
        var brojac1=7-brojac%7-1;
        var kolona=brojac%7+1;
    
        for(brojac;brojac>0;brojac--){
        if(kolona<7 && kalendarRef.rows!=undefined)kalendarRef.rows[brojReda].cells[kolona].classList.add("nevidljiva");
        kolona++;
        }
        }
        
        if(brojReda==7){
            var brojac1=7-brojac%7-1;
        var kolona=brojac%7+1;
        for(brojac;brojac>0;brojac--){
            if(kolona<7 && kalendarRef.rows!=undefined)kalendarRef.rows[brojReda].cells[kolona].classList.add("nevidljiva");
        kolona++;
        }
    
    }}}
    return {
    obojiZauzeca: obojiZauzeca,
    ucitajPodatke: ucitajPodatke,
    iscrtajKalendar: iscrtajKalendar,
    daniUGodini: daniUGodini,
    prviDan: prviDan,
    vanredna: vanredna,
    periodicna: periodicna
    }
    }());


    