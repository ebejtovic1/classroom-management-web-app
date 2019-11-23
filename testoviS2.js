let assert = chai.assert;
describe('Kalendar', function() {
 describe('iscrtajKalendar()', function() {
   it('Pozivanje iscrtajKalendar za mjesec sa 30 dana: očekivano je da se prikaže 30 dana', function() {
       //Ispitujemo za septembar koliko ce prikazati dana
     Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 8);
     var x = document.getElementsByClassName("malyTabela");
     var y = document.getElementsByClassName("nevidljiva");
     assert.equal(x.length-y.length, 30);
    
   });

   it('Pozivanje iscrtajKalendar za mjesec sa 31 dan: očekivano je da se prikaže 31 dan', function() {
    //Ispitujemo za  koliko ce prikazati dana
  Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 11);
  var x = document.getElementsByClassName("malyTabela");
  var y = document.getElementsByClassName("nevidljiva");
  assert.equal(x.length-y.length, 31);
 
});

it('Pozivanje iscrtajKalendar za trenutni mjesec: očekivano je da je 1. dan u petak', function() {
    //Trenutni je Novembar tj 10.mjesec
  Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 10);
  var x = document.getElementsByClassName("malyTabela");
  var y = document.getElementsByClassName("nevidljiva");
  var brojac=0;
  var pronadji=document.getElementsByClassName("prviRed");
  var pronadji1=pronadji[0].getElementsByClassName("nevidljiva");
  //trebamo imati 4 prazne celije kako bi prvi dan pocinjao od petka
  assert.equal(pronadji1.length, 4); 
  assert.equal(pronadji[0].getElementsByClassName("gore")[4].innerHTML,1);
 
});

it('Pozivanje iscrtajKalendar za trenutni mjesec: očekivano je da je 30. dan u subotu', function() {
    //Trenutni je Novembar tj 10.mjesec
  Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 10);
  var x = document.getElementsByClassName("malyTabela");
  var y = document.getElementsByClassName("nevidljiva");
  var brojac=0;
  var pronadji=document.getElementsByClassName("petiRed");
  //subota je 5. po redu 
  assert.equal(pronadji[0].getElementsByClassName("gore")[5].innerHTML,30);
 
});

it('Pozivanje iscrtajKalendar za januar: očekivano je da brojevi dana idu od 1 do 31 počevši od utorka', function() {
  Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 0);
  var a = document.getElementsByClassName("nevidljiva");
  var x = document.getElementsByClassName("malyTabela");
  var y = document.getElementsByClassName("nevidljiva");
  var brojac=0;
  var pronadji=document.getElementsByClassName("prviRed");
  var pronadji1=pronadji[0].getElementsByClassName("nevidljiva");
  //test da li 1. dan pocinje u utorak
  assert.equal(pronadji1.length, 1); 
  assert.equal(pronadji[0].getElementsByClassName("gore")[1].innerHTML,1);
  //test da li ima 31 dan 
  Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 0);
     var x = document.getElementsByClassName("malyTabela");
     var y = document.getElementsByClassName("nevidljiva");
     x=x.length;
     y=y.length+6; //broj nevidljivih celija plus 6 zbog zadnje sedmice
     assert.equal(x-y, 31);
     //test da li je 31. u cetvrtak
     pronadji=document.getElementsByClassName("petiRed");
     assert.equal(pronadji[0].getElementsByClassName("gore")[3].innerHTML,31);
});

it('Test kad se posalje pogresan mjesec >11', function() {
  Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 8);
  Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 42);
  //Trebao je ostati početni septembar
  var x = document.getElementsByClassName("malyTabela");
  var y = document.getElementsByClassName("nevidljiva");
  assert.equal(document.getElementById("nazivMjeseca").innerHTML,"Septembar");
 
});
it('Test kad se posalje pogresan mjesec <0', function() {
    Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 8);
    Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), -42);
    //Trebao je ostati početni septembar
    var x = document.getElementsByClassName("malyTabela");
    var y = document.getElementsByClassName("nevidljiva");
    assert.equal(document.getElementById("nazivMjeseca").innerHTML,"Septembar");
  });
  
 });

 describe('obojiZauzeca()', function() {
    it('Pozivanje obojiZauzeca kada podaci nisu učitani: očekivana vrijednost da se ne oboji niti jedan dan', function() {
        Kalendar.ucitajPodatke([], []);
        Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 8);     
        Kalendar.obojiZauzeca(document.getElementById("tabelaSala"), 8, "", "", "");
        var zauzetih = document.getElementsByClassName("zauzeta");
        assert.equal(zauzetih.length, 0, "Treba bit 0 zauzetih");
    });

    it('Pozivanje obojiZauzeca gdje u zauzećima postoje duple vrijednosti za zauzeće istog termina: očekivano je da se dan oboji bez obzira što postoje duple vrijednosti', function () {
        Kalendar.ucitajPodatke([], []);
        Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 0);
        var vanredni = [
            {
              datum: "02.01.2019",
              pocetak: "12:00",
              kraj: "12:30",
              naziv: "0-01",
              predavac: "Profesor"
            },
            {
                datum: "02.01.2019",
                pocetak: "12:00",
                kraj: "12:30",
                naziv: "0-01",
                predavac: "Profesor"
              }
          ]
        
        Kalendar.ucitajPodatke([], vanredni);
        Kalendar.obojiZauzeca(document.getElementById("tabelaSala"), 0, "0-01", "12:00", "12:30");
        var zauzeti = document.getElementsByClassName("zauzeta");
        assert.equal(zauzeti.length, 1);
      });

    it('Pozivanje obojiZauzece kada u podacima postoji periodično zauzeće za drugi semestar: očekivano je da se ne oboji zauzeće', function () {
        Kalendar.ucitajPodatke([], []);
        Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 5);
        var periodicni = [
          {
            dan: 1,
            semestar: "zimski",
            pocetak: "12:00",
            kraj: "12:30",
            naziv: "1-01",
            predavac: "Profesor"
          }
        ]
        Kalendar.ucitajPodatke(periodicni, []);
        Kalendar.obojiZauzeca(document.getElementById("tabelaSala"), 5, "1-01", "12:00", "12:30");
        var zauzetih = document.getElementsByClassName("zauzeta");
        //zauzeli zimski semestar a iscrtan juni
        assert.equal(zauzetih.length, 0, "Treba bit 0 zauzetih");
      });

      it('Pozivanje obojiZauzece kada u podacima postoji zauzeće termina ali u drugom mjesecu: očekivano je da se ne oboji zauzeće', function () {
        Kalendar.ucitajPodatke([], []);
        Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 5);
        var vanredni = [
            {
              datum: "01.01.2019",
              pocetak: "12:00",
              kraj: "12:30",
              naziv: "0-01",
              predavac: "Profesor"
            }
          ]
        
        Kalendar.ucitajPodatke([], vanredni);
        Kalendar.obojiZauzeca(document.getElementById("tabelaSala"), 0, "2-02", "08:00", "09:30");
        var zauzeti = document.getElementsByClassName("zauzeta");
        //zauzeli januar a iscrtan juni
        assert.equal(zauzeti.length, 0, "Treba bit 0 zauzetih jer smo zauzeli novembar a iscrtan je april");

      });

      it('Pozivanje obojiZauzece kada su u podacima svi termini u mjesecu zauzeti: očekivano je da se svi dani oboje', function () {
        //pocnimo sa iscrtanim kalendarom svih slobodnih dana
        Kalendar.ucitajPodatke([], []);
        Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 10);
     
        var redovni = [];
        for (var i = 0; i <7; i++) {
          redovni.push({
            dan: i,
            semestar: "zimski",
            pocetak: "12:00",
            kraj: "12:30",
            naziv: "0-01",
            predavac: "Profesor"
          })
        }
        Kalendar.ucitajPodatke(redovni, []);
        Kalendar.obojiZauzeca(document.getElementById("tabelaSala"), 10, "0-01", "12:00", "12:30");
        var zauzetih = document.getElementsByClassName("slobodna");
        assert.equal(zauzetih.length, 0, "Treba bit 0 slobodnih");
      });

      

      it('Pozivanje ucitajPodatke, obojiZauzeca, ucitajPodatke - drugi podaci, obojiZauzeca: očekivano da se zauzeća iz prvih podataka ne ostanu obojena, tj. primjenjuju se samo posljednje učitani podaci', function () {
        Kalendar.ucitajPodatke([], []);
        Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 0);
        var vanredni = [
            {
              datum: "02.01.2019",
              pocetak: "12:00",
              kraj: "12:30",
              naziv: "0-01",
              predavac: "Profesor"
            },
          ]
        
        Kalendar.ucitajPodatke([], vanredni);
        Kalendar.obojiZauzeca(document.getElementById("tabelaSala"), 0, "0-01", "12:00", "12:30");

        var vanredni1 = [
            {
              datum: "03.01.2019",
              pocetak: "12:00",
              kraj: "12:30",
              naziv: "0-01",
              predavac: "Profesor"
            },
          ]
          Kalendar.ucitajPodatke([], vanredni1);
          Kalendar.obojiZauzeca(document.getElementById("tabelaSala"), 0, "0-01", "12:00", "12:30");
        var zauzeti = document.getElementsByClassName("zauzeta");
        //ocekuje se da se samo 3.1.2019 oboji
        assert.equal(zauzeti.length, 1);
      });

      it('Dva puta uzastopno pozivanje obojiZauzece: očekivano je da boja zauzeća ostane ista', function () {
        Kalendar.ucitajPodatke([], []);
        Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 0);
        var vanredni = [
            {
              datum: "02.01.2019",
              pocetak: "12:00",
              kraj: "12:30",
              naziv: "0-01",
              predavac: "Profesor"
            }
          ]
        
        Kalendar.ucitajPodatke([], vanredni);
        //uzastopno pozivanje
        Kalendar.obojiZauzeca(document.getElementById("tabelaSala"), 0, "0-01", "12:00", "12:30");
        Kalendar.obojiZauzeca(document.getElementById("tabelaSala"), 0, "0-01", "12:00", "12:30");
        var zauzeti = document.getElementsByClassName("zauzeta");
        assert.equal(zauzeti.length, 1);
      });

      it('Test po izboru: Da li preskace nepravilne podatke', function () {
        Kalendar.ucitajPodatke([], []);
        Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 3);
        var vanredni = [
            {
              datum: "01.04.2019",
              pocetak: "12:00",
              kraj: "12:30",
              naziv: "0-01",
              predavac: "Profesor"
            },
            {
                datum: "14.04.2019",
                pocetak: "12:00",
                kraj: "12:30",
                naziv: "0-01",
                predavac: "Profesor"
              },
              {
                datum: "51.44.5019",
                pocetak: "12:00",
                kraj: "12:30",
                naziv: "0-01",
                predavac: "Profesor"
              }
          ]
        
        Kalendar.ucitajPodatke([], vanredni);
        Kalendar.obojiZauzeca(document.getElementById("tabelaSala"), 3, "0-01", "12:00", "12:30");
        var zauzeti = document.getElementsByClassName("zauzeta");
        //trebaju 2 biti obojena a treci ignorisan
        assert.equal(zauzeti.length, 2);
      });
      it('Test po izboru: Svi podaci neispravni, ne treba nista obojiti', function () {
        Kalendar.ucitajPodatke([], []);
        Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"), 3);
        var vanredni = [
            {
              datum: "35.33.2019",
              pocetak: "12:00",
              kraj: "12:30",
              naziv: "0-01",
              predavac: "Profesor"
            },
            {
                datum: "42.53.2019",
                pocetak: "12:00",
                kraj: "12:30",
                naziv: "0-01",
                predavac: "Profesor"
              },
              {
                datum: "51.44.5019",
                pocetak: "12:00",
                kraj: "12:30",
                naziv: "0-01",
                predavac: "Profesor"
              }
          ]
        
        Kalendar.ucitajPodatke([], vanredni);
        Kalendar.obojiZauzeca(document.getElementById("tabelaSala"), 3, "0-01", "12:00", "12:30");
        var zauzeti = document.getElementsByClassName("zauzeta");
        assert.equal(zauzeti.length, 0);
      });
      
});
});


