function presjekVremena(pocetak1, kraj1, pocetak2, kraj2){
    var poc1 = (parseInt(pocetak1.substring(0,2),10))*60+parseInt(pocetak1.substring(3,5),10);
    var kra1 = (parseInt(kraj1.substring(0,2),10))*60+parseInt(kraj1.substring(3,5),10);
    var poc2 = (parseInt(pocetak2.substring(0,2),10))*60+parseInt(pocetak2.substring(3,5),10);
    var kra2 = (parseInt(kraj2.substring(0,2),10))*60+parseInt(kraj2.substring(3,5),10);
    if((poc2>=poc1 && poc2<=kra1)||(kra2>=poc1 && kra2<=kra1)||(poc2<=poc1 && kra2>=kra1))return true;
    return false;
}


const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));

var indeks=0;
app.get("/", function(req, res){
    res.sendFile(__dirname + "/pocetna.html");
});
app.get("/pocetna.html", function(req, res){
    res.sendFile(__dirname + "/pocetna.html");
});
app.get("/zauzeca", function(req, res){
    res.sendFile(__dirname + "/json/zauzeca.json");
});
app.get("/pozivi.js", function(req, res){
    res.sendFile(__dirname + "/pozivi.js");
});

app.post("/slika1", function(req, res){
    var noviNiz=[];
    var kraj=false;
    var pocetak=req.body.pocetak;
    fs.readdir("./Images", (err, files) => {
        let duzinaFajla=files.length;
    if(pocetak)indeks=0;
        const u=(indeks+3<files.length)?indeks+3:files.length;
        if(indeks==files.length-1 || indeks==files.length-2){
            if(indeks==files.length-1){
                noviNiz.push(`http://localhost:8080/Images/${files[indeks]}`);
                indeks++;
            }
            if(indeks==files.length-2){
                noviNiz.push(`http://localhost:8080/Images/${files[indeks]}`);
                noviNiz.push(`http://localhost:8080/Images/${files[indeks+1]}`);
                indeks+=2;

            }
        }
        else{
        for(let m=indeks;m<u;m++){
            noviNiz.push(`http://localhost:8080/Images/${files[m]}`);
        }}
        indeks+=3;
        if(indeks>=files.length){
            kraj=true;
        }
        var objekat={noviNiz,kraj,duzinaFajla};
        res.json(objekat);
      });
    
});

app.post("/zauzeca", (req, res)=>{
    const datum = req.body.datum;
    const sala = req.body.sala;
    const pocetak = req.body.pocetak;
    const kraj = req.body.kraj;
    let zauzeto=false;
    
    fs.readFile('./json/zauzeca.json', (error,data)=>{
        if(error){
            throw error;
        }
        const dataa = JSON.parse(data);
        const van=dataa.vanredna;
        //provjeravamo zauzece na serveru
        for(let i=0;i<van.length;i++){
            if (van[i].datum==datum && presjekVremena(van[i].pocetak,van[i].kraj,pocetak,kraj) && van[i].naziv==sala){
                zauzeto=true;
            }        }
        let novaLinija={
            datum,
            pocetak,
            kraj,
            naziv:sala,
            predavac:"profesor"
        };
        //ako nije zauzeto, upisujemo u zauzeca.json i vracamo sva zauzeca
        if(!zauzeto){
        van.push(novaLinija);
        fs.writeFile('./json/zauzeca.json', JSON.stringify(dataa), (error)=>{});}
        var dataaa={dataa,zauzeto};
        res.json(dataaa);
    })
});
app.post("/zauzeca1", (req, res)=>{
    let zauzeto=false;
    const dan = req.body.dan;
    const semestar=req.body.semestar;
    const sala = req.body.sala;
    const pocetak = req.body.pocetak;
    const kraj = req.body.kraj;
    
    //citamo sva zauzeca iz zauzeca.json
    fs.readFile('./json/zauzeca.json', (error,data)=>{
        if(error){
            throw error;
        }
        const dataa = JSON.parse(data);
        const per=dataa.periodicna;
        const van=dataa.vanredna; 
        //provjeravamo na serveru da li ima isto periodicno zauzece
        for(let i=0;i<per.length;i++){
            if (per[i].dan==dan && per[i].semestar==semestar && presjekVremena(per[i].pocetak,per[i].kraj,pocetak,kraj) && per[i].naziv==sala){
                zauzeto=true;
        }}

        //provjeravamo na serveru da li ima vanredno zauzece zbog kojeg se periodicno ne bi moglo zauzeti
        for(let p=0;p<van.length;p++){
            const b=van[p].datum;
            let provjeraSemestra="";
            let provjeraDana=b.substring(0,2);
            if(provjeraDana[0]=='0')provjeraDana=provjeraDana.substring(1);
            provjeraDana=parseInt(provjeraDana,10);
            let provjeraMjeseca=b.substring(3,5);
            if(provjeraMjeseca[0]=='0')provjeraMjeseca=provjeraMjeseca.substring(1);
            provjeraMjeseca=parseInt(provjeraMjeseca,10);
            if(provjeraMjeseca==10 || provjeraMjeseca==11 || provjeraMjeseca==12 || provjeraMjeseca==1)provjeraSemestra="zimski";
            if(provjeraMjeseca==2 || provjeraMjeseca==3 || provjeraMjeseca==4 || provjeraMjeseca==5 || provjeraMjeseca==6)provjeraSemestra="ljetni";
            let provjeraDatuma=new Date(2019,provjeraMjeseca-1,provjeraDana+1);
            provjeraDatuma=provjeraDatuma.getDay()-2;
            if(provjeraDatuma<0)provjeraDatuma+=7;
            if(provjeraDatuma==dan && provjeraSemestra==semestar && presjekVremena(van[p].pocetak,van[p].kraj,pocetak,kraj) && van[p].naziv==sala){
                zauzeto=true;
            }

        }
        let novaLinija={
            dan,
            semestar,
            pocetak,
            kraj,
            naziv:sala,
            predavac:"profesor"
        };

        //ako nema zauzeca dodajemo novo zauzece u zauzeca.json i vracamo sva zauzeca
        if(!zauzeto){
            per.push(novaLinija);
            fs.writeFile('./json/zauzeca.json', JSON.stringify(dataa), (error)=>{});
            }
            var dataaa={dataa,zauzeto};
            res.json(dataaa);
            
    })
});
app.listen(8080);