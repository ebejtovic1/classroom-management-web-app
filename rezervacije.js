var mj= Number(0);
function sljedeci(){
    if (mj<11 && mj>=0){
            mj++;
            Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"),mj);
        }
    if(mj==11)document.getElementsByClassName("button1").disabled=true;
    myFunction();
}

function prethodni(){
    if (mj<=11 && mj>0){
             mj--;
             Kalendar.iscrtajKalendar(document.getElementById("tabelaSala"),mj);
            }
    if(mj==0)document.getElementsByClassName("button").disabled=true;
    myFunction();
}
 
function myFunction(){
    Pozivi.ucitavanje();
}

function naUcitavanje(){
    Pozivi.ucitavanjeOsoblja();
    naUcitavanje1();
  
}

function naUcitavanje1() {

    Pozivi.ucitavanjeSala();   
    
}

function naKlik(inf){
    Pozivi.kliknuto(inf);
}


