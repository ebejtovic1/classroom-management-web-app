function presjekVremena(pocetak1, kraj1, pocetak2, kraj2){
    var poc1 = (parseInt(pocetak1.substring(0,2),10))*60+parseInt(pocetak1.substring(3,5),10);
    var kra1 = (parseInt(kraj1.substring(0,2),10))*60+parseInt(kraj1.substring(3,5),10);
    var poc2 = (parseInt(pocetak2.substring(0,2),10))*60+parseInt(pocetak2.substring(3,5),10);
    var kra2 = (parseInt(kraj2.substring(0,2),10))*60+parseInt(kraj2.substring(3,5),10);
    if((poc2>=poc1 && poc2<=kra1)||(kra2>=poc1 && kra2<=kra1)||(poc2<=poc1 && kra2>=kra1))return true;
    return false;
}

function jeLiIzmedju(pocetak1, kraj1){
    var start = (parseInt(pocetak1.substring(0,2),10))*60+parseInt(pocetak1.substring(3,5),10);
    var end = (parseInt(kraj1.substring(0,2),10))*60+parseInt(kraj1.substring(3,5),10);
   
    const date = new Date(); 
    const now = date.getHours() * 60 + date.getMinutes();

    return(start <= now && now <= end);
}


const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));

const db = require('./db.js')

db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
    });
});

Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function inicializacija() {
    var osobljeListaPromisea = [];
    var saleListaPromisea = [];
    var terminListaPromisea = [];
    var rezervacijeListaPromisea = [];
    return new Promise(function(resolve, reject){

        //Punimo tabelu osoblje podacima

        osobljeListaPromisea.push(db.osoblje.create({ime:'Neko', prezime: 'Nekic', uloga:'profesor'}));
        osobljeListaPromisea.push(db.osoblje.create({ime:'Drugi', prezime: 'Neko', uloga:'asistent'}));
        osobljeListaPromisea.push(db.osoblje.create({ime:'Test', prezime: 'Test', uloga:'asistent'}));

        Promise.all(osobljeListaPromisea).then(function(osobe){
            let prvaOsoba = osobe.filter(function (a){ return a.ime === 'Neko' })[0];
            let drugaOsoba = osobe.filter(function (a){ return a.ime === 'Drugi' })[0];
            let trecaOsoba = osobe.filter(function (a){ return a.ime === 'Test' })[0];
           
            //Punimo tabelu sala nakon sto je popujena tabelao osoblje 
            saleListaPromisea.push(db.sala.create({ naziv: '1-11', zaduzenaOsoba: prvaOsoba.id }).then(function(s){
                saleListaPromisea.push(db.sala.create({ naziv: '1-15', zaduzenaOsoba: drugaOsoba.id }));
                return new Promise(function(resolve, reject){resolve(s);});
            }));
            
            //Punimo tabelu termina
            terminListaPromisea.push(db.termin.create({redovni:false, dan:null, datum:'01.01.2020',semestar:null, pocetak:'12:00', kraj:'13:00'}));
            terminListaPromisea.push(db.termin.create({redovni:true, dan:0, datum:null, semestar:'zimski', pocetak:'13:00', kraj:'14:00'}));

            Promise.all(terminListaPromisea).then(function(termini){

                let prviTermin = termini.filter(function(b){ return b.datum==='01.01.2020'})[0];
                let drugiTermin = termini.filter(function(b){ return b.semestar === 'zimski' })[0];

                Promise.all(saleListaPromisea).then(function(sale){
                    let prvaSala = sale.filter(function(c){ return c.naziv === '1-11' })[0];
                    //Popunjavamo i tabelu rezervacije nakon sto smo sigurni da su popunjene tabele termin i sale
                    rezervacijeListaPromisea.push(db.rezervacija.create({termin: prviTermin.id, sala: prvaSala.id, osoba:prvaOsoba.id}));
                    rezervacijeListaPromisea.push(db.rezervacija.create({termin: drugiTermin.id, sala: prvaSala.id, osoba: trecaOsoba.id}));
                    Promise.all(rezervacijeListaPromisea).then(function(b){resolve(b);}).catch(function(err){console.log("Rezervacije greska "+err);});
                }).catch(function(err){console.log("Sale greska "+err);});  
            }).catch(function(err){console.log("Termini greska "+err);});  
        }).catch(function(err){console.log("Osoblje greska "+err);});  
    });
}
    

var indeks=0;
app.get("/", function(req, res){
    res.sendFile(__dirname + "/pocetna.html");
});
app.get("/pocetna.html", function(req, res){
    res.sendFile(__dirname + "/pocetna.html");
});
app.get("/zauzeca", function(req, res){
    let periodicna= [];
    let vanredna=[];
    let objekat={periodicna, vanredna};
    db.rezervacija.findAll().then(async function(data){
        for(let n=0; n<data.length; n++){

            let d = await db.termin.findOne({where:{id:data[n].termin}});
            let e = await db.sala.findOne({where:{id:data[n].sala}});
            let f = await db.osoblje.findOne({where:{id:data[n].osoba}});
            let nizPer={
                dan: 0,
                semestar: "",
                pocetak: "",
                kraj: "",
                naziv:"",
                predavac:""
            };

            let nizVan={
                datum:"",
                pocetak: "",
                kraj: "",
                naziv:"",
                predavac:""
            };
            if(d.redovni==false){
                nizVan.datum=d.datum;
                nizVan.pocetak=d.pocetak.substring(0,5);
                nizVan.kraj=d.kraj.substring(0,5);
                nizVan.naziv=e.naziv;
                nizVan.predavac=f.ime+" "+f.prezime;
                vanredna.push(nizVan);
            }
            else{
                nizPer.dan=d.dan;
                nizPer.semestar=d.semestar;
                nizPer.pocetak=d.pocetak.substring(0,5);
                nizPer.kraj=d.kraj.substring(0,5);
                nizPer.naziv=e.naziv;
                nizPer.predavac=f.ime+" "+f.prezime;
                periodicna.push(nizPer);
            }
        }
        res.json(objekat);
    });
});
app.get("/pozivi.js", function(req, res){
    
    res.sendFile(__dirname + "/pozivi.js");
});

app.get("/osoblje", function(req, res){

    db.osoblje.findAll().then(function(dataa){
        let data=[];

        for(let i=0;i<dataa.length;i++){
            let objekat={
                id: dataa[i].id,
                ime: dataa[i].ime,
                prezime: dataa[i].prezime,
                uloga: dataa[i].uloga
            };
            data.push(objekat);
        }
        res.json(data);
    });
});

app.get("/sveSale", function(req, res){

    db.sala.findAll().then(function(dataa){
        let data=[];

        for(let i=0;i<dataa.length;i++){
            let objekat={
                naziv: dataa[i].naziv
            };
            data.push(objekat);
        }
        res.json(data);
    });
});

app.get("/rez", function(req, res){
    var nizRezervacija=[];
    
    let trenutnoVrijeme=new Date();

    //vraćamo svo osoblje
    db.osoblje.findAll().then(async function(arr){
        for(let h=0;h<arr.length;h++){
            let imeIPrezime= arr[h].ime+ " " + arr[h].prezime;
        
            let noviRed={
                ime: imeIPrezime,
                sala:'U kancelariji'
            };
            let pronadjeno=false;
            //za svaku osobu vraćamo rezervacije
            let a = await db.rezervacija.findAll({where:{osoba:arr[h].id}});
                //ako nema rezervacija nikako u kancelariji je
                if(a.length==0){
                    noviRed.sala="U kancelariji";
                    nizRezervacija.push(noviRed); 
                }
                else{
                    for(let ha=0;ha<a.length;ha++){
                        //za sve rezervacije te osobe vraćamo termine
                        let b = await db.termin.findOne({where:{id:a[ha].termin}});

                        if(b.redovni==false){
                           
                            if(jeLiIzmedju(b.pocetak, b.kraj) && trenutnoVrijeme.getDate()==parseInt(b.datum.substring(0,2),10) && trenutnoVrijeme.getMonth()+1==parseInt(b.datum.substring(3,5),10)){
                                let c=await db.sala.findOne({where:{id:a[ha].sala}});
                                    if(noviRed.sala=='U kancelariji'){
                                        noviRed.sala=c.naziv;}                            
                            }}
                            else{
                                let trenutniSemestar=trenutnoVrijeme.getMonth()+1;
                                if(trenutniSemestar==10 || trenutniSemestar==11 || trenutniSemestar==12 || trenutniSemestar==1)trenutniSemestar="zimski";
                                if(trenutniSemestar==2 || trenutniSemestar==3 || trenutniSemestar==4 || trenutniSemestar==5 || trenutniSemestar==6)trenutniSemestar="ljetni";

                                let TrenutniDatum=new Date();

                                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                                options.timeZone = 'UTC';
                                options.timeZoneName = 'short';

                                let noviDatum1="";
                                let noviDatum=(new Intl.DateTimeFormat('en-US', options).format(TrenutniDatum));
                                for(let r=0;r<noviDatum.length;r++){
                                    if(noviDatum[r]==',')break;
                                    noviDatum1+=noviDatum[r];
                                }
                                if(noviDatum1=='Monday')TrenutniDatum=0;
                                if(noviDatum1=='Tuesday')TrenutniDatum=1;
                                if(noviDatum1=='Wednesday')TrenutniDatum=2;
                                if(noviDatum1=='Thursday')TrenutniDatum=3;
                                if(noviDatum1=='Friday')TrenutniDatum=4;
                                if(noviDatum1=='Saturday')TrenutniDatum=5;
                                if(noviDatum1=='Sunday')TrenutniDatum=6;
                                if(jeLiIzmedju(b.pocetak, b.kraj) && TrenutniDatum==b.dan && trenutniSemestar==b.semestar){
                                    let c=await db.sala.findOne({where:{id:a[ha].sala}});
                                        if(noviRed.sala=='U kancelariji'){
                                            noviRed.sala=c.naziv;}}
                            }
                    if(ha==a.length-1)nizRezervacija.push(noviRed); 
                }}
        }

        res.json(nizRezervacija);
    }); 
    
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


app.post("/zauzeo", async function(req, res){
    let datum=req.body.datum;
    let pocetak=req.body.pocetak;
    let salaa=req.body.sala;
    let kraj=req.body.kraj;
    let osoba="";

    let provjeraSemestra="";
            let provjeraDana=datum.substring(0,2);
            if(provjeraDana[0]=='0')provjeraDana=provjeraDana.substring(1);
            provjeraDana=parseInt(provjeraDana,10);
            let provjeraMjeseca=datum.substring(3,5);

            if(provjeraMjeseca[0]=='0')provjeraMjeseca=provjeraMjeseca.substring(1);
            provjeraMjeseca=parseInt(provjeraMjeseca,10);
            if(provjeraMjeseca==10 || provjeraMjeseca==11 || provjeraMjeseca==12 || provjeraMjeseca==1)provjeraSemestra="zimski";
            if(provjeraMjeseca==2 || provjeraMjeseca==3 || provjeraMjeseca==4 || provjeraMjeseca==5 || provjeraMjeseca==6)provjeraSemestra="ljetni";
            let provjeraDatuma=new Date(Date.UTC(2020,provjeraMjeseca-1,provjeraDana));

            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            options.timeZone = 'UTC';
            options.timeZoneName = 'short';

            let noviDatum1="";
            let noviDatum=(new Intl.DateTimeFormat('en-US', options).format(provjeraDatuma));
            for(let r=0;r<noviDatum.length;r++){
                if(noviDatum[r]==',')break;
                noviDatum1+=noviDatum[r];
            }
            if(noviDatum1=='Monday')provjeraDatuma=0;
            if(noviDatum1=='Tuesday')provjeraDatuma=1;
            if(noviDatum1=='Wednesday')provjeraDatuma=2;
            if(noviDatum1=='Thursday')provjeraDatuma=3;
            if(noviDatum1=='Friday')provjeraDatuma=4;
            if(noviDatum1=='Saturday')provjeraDatuma=5;
            if(noviDatum1=='Sunday')provjeraDatuma=6;

    let e = await db.sala.findOne({where:{naziv:salaa}});
    e=e.id;
    let k = await db.rezervacija.findAll({where:{sala:e}});
    if(k.length==1){
        let idOsobe=k[0].osoba;
        let z = await db.osoblje.findOne({where:{id:idOsobe}});
        osoba+=z.ime+ " "+z.prezime;   
    }
    else{
        let pronasao=false;
        for(let b=0;b<k.length;b++){
            if(pronasao==true)break;
            let f = await db.termin.findOne({where:{id:k[b].termin}});
            if(f.redovni==false){
                if(presjekVremena(pocetak, kraj, f.pocetak, f.kraj) && datum==f.datum){
                    let elma = await db.osoblje.findOne({where:{id:k[b].osoba}});
                    osoba=elma.ime+ " "+elma.prezime;  
                    pronasao=true;
                }
            }

            else{
                
                if(presjekVremena(pocetak, kraj, f.pocetak, f.kraj) && provjeraDatuma==f.dan && provjeraSemestra==f.semestar){
                    let elma = await db.osoblje.findOne({where:{id:k[b].osoba}});
                    osoba=elma.ime+ " "+elma.prezime;  
                    pronasao=true;
                }
            }
        }
    }
    res.json(osoba);
});
    

app.post("/zauzeca", async function(req, res){
    const datum = req.body.datum;
    const sala = req.body.sala;
    const pocetak = req.body.pocetak;
    const kraj = req.body.kraj;
    const predavac = req.body.predavac;
    let zauzeto=false;

    let nizVan={
        datum:"",
        pocetak: "",
        kraj: "",
        naziv:"",
        predavac:""
    };
    let nizPer={
        dan: 0,
        semestar: "",
        pocetak: "",
        kraj: "",
        naziv:"",
        predavac:""
    };
    let vanredna=[];
    let periodicna=[];
    let objekat={periodicna, vanredna};
    db.rezervacija.findAll().then(async function(data){
        for(let n=0; n<data.length; n++){
            let d = await db.termin.findOne({where:{id:data[n].termin}});
            let e = await db.sala.findOne({where:{id:data[n].sala}});
            let f = await db.osoblje.findOne({where:{id:data[n].osoba}});
            
            if(d.redovni==false){
                nizVan.datum=d.datum;
                nizVan.pocetak=d.pocetak.substring(0,5);
                nizVan.kraj=d.kraj.substring(0,5);
                nizVan.naziv=e.naziv;
                nizVan.predavac=f.ime+" "+f.prezime;
                vanredna.push(nizVan);
            }
            else{
                nizPer.dan=d.dan;
                nizPer.semestar=d.semestar;
                nizPer.pocetak=d.pocetak.substring(0,5);
                nizPer.kraj=d.kraj.substring(0,5);
                nizPer.naziv=e.naziv;
                nizPer.predavac=f.ime+" "+f.prezime;
                periodicna.push(nizPer);
            }
        }

        let van=vanredna;
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
                predavac:predavac
        };
        //ako nije zauzeto, upisujemo u bazu i vraćamo sva zauzeća
        if(!zauzeto){

            vanredna.push(novaLinija);
            let k = await db.termin.create({redovni:false, dan:null, datum:datum ,semestar:null, pocetak:pocetak, kraj:kraj});
            let g = await db.sala.findOne({where:{naziv:sala}});
            g=g.id;
            let h = await db.termin.findAll();
            h= h[h.length-1].id;
            let imePredavaca="";
            for(let p=0;p<predavac.length;p++){
                if(predavac[p]!=" ")imePredavaca+=predavac[p];
                else break;
            }
            
            let v = await db.osoblje.findOne({where:{ime:imePredavaca}});
            v=v.id;
            let j = await db.rezervacija.create({termin: h, sala: g, osoba: v});

    }
        var dataaa={objekat,zauzeto};
        res.json(dataaa);
    });
    
});


app.post("/zauzeca1", async function(req, res){
    const dan = req.body.dan;
    const semestar=req.body.semestar;
    const sala = req.body.sala;
    const pocetak = req.body.pocetak;
    const kraj = req.body.kraj;
    const predavac = req.body.predavac;
    let zauzeto=false;

    let vanredna=[];
    let periodicna=[];
    let objekat={periodicna, vanredna};
    db.rezervacija.findAll().then(async function(data){
        for(let n=0; n<data.length; n++){
            let d = await db.termin.findOne({where:{id:data[n].termin}});
            let e = await db.sala.findOne({where:{id:data[n].sala}});
            let f = await db.osoblje.findOne({where:{id:data[n].osoba}});

            
            if(d.redovni==false){
                let nizVan={
                    datum:d.datum,
                    pocetak: d.pocetak.substring(0,5),
                    kraj: d.kraj.substring(0,5),
                    naziv:e.naziv,
                    predavac:f.ime+" "+f.prezime
                };
                vanredna.push(nizVan);
            }
            else{
                
   
    let nizPer={
        dan:d.dan,
        semestar:d.semestar,
        pocetak:d.pocetak.substring(0,5),
        kraj:d.kraj.substring(0,5),
        naziv:e.naziv,
        predavac:f.ime+" "+f.prezime
    };

                
                periodicna.push(nizPer);
            }
        }

        let per=periodicna;
        let van=vanredna;

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

            let provjeraDatuma=new Date(Date.UTC(2020,provjeraMjeseca-1,provjeraDana));

            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            options.timeZone = 'UTC';
            options.timeZoneName = 'short';

            let noviDatum1="";
            let noviDatum=(new Intl.DateTimeFormat('en-US', options).format(provjeraDatuma));
            for(let r=0;r<noviDatum.length;r++){
                if(noviDatum[r]==',')break;
                noviDatum1+=noviDatum[r];
            }
            if(noviDatum1=='Monday')provjeraDatuma=0;
            if(noviDatum1=='Tuesday')provjeraDatuma=1;
            if(noviDatum1=='Wednesday')provjeraDatuma=2;
            if(noviDatum1=='Thursday')provjeraDatuma=3;
            if(noviDatum1=='Friday')provjeraDatuma=4;
            if(noviDatum1=='Saturday')provjeraDatuma=5;
            if(noviDatum1=='Sunday')provjeraDatuma=6;


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
            predavac:predavac
        };
            
        //ako nije zauzeto, upisujemo u bazu i vraćamo sva zauzeća
        if(!zauzeto){

            periodicna.push(novaLinija);
            let k = await db.termin.create({redovni:true, dan:dan, datum:null ,semestar:semestar, pocetak:pocetak, kraj:kraj});
            let g = await db.sala.findOne({where:{naziv:sala}});
            g=g.id;
            let h = await db.termin.findAll();
            h= h[h.length-1].id;
            let imePredavaca="";
            for(let p=0;p<predavac.length;p++){
                if(predavac[p]!=" ")imePredavaca+=predavac[p];
                else break;
            }
            
            let v = await db.osoblje.findOne({where:{ime:imePredavaca}});
            v=v.id;
            let j = await db.rezervacija.create({termin: h, sala: g, osoba: v});

    }
        var dataaa={objekat,zauzeto};
        res.json(dataaa);
    });
    
});
module.exports=app;
app.listen(8080);