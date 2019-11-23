var mj= new Date().getMonth();
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
    var nesto1= new Kalendar.periodicna(1, "zimski", "14:00", "15:00", "0-01", "profesor");
    var nesto2= new Kalendar.periodicna(2, "zimski", "14:00", "15:00", "0-02", "profesor");
    var nesto3= new Kalendar.periodicna(3, "ljetni", "14:00", "15:00", "0-03", "profesor");
    var nesto0= new Kalendar.periodicna(0, "zimski", "14:00", "15:00", "0-04", "profesor");
    var nesto7= new Kalendar.periodicna(5, "zimski", "14:00", "15:00", "1-01", "profesor");
    var nesto8= new Kalendar.periodicna(6, "zimski", "14:00", "15:00", "1-02", "profesor");
    var nesto4= new Kalendar.vanredna("07.11.2019", "14:00", "15:00", "0-01", "profesor");
    var nesto5= new Kalendar.vanredna("23.11.2019", "14:00", "15:00", "0-05", "profesor");
    var nesto6= new Kalendar.vanredna("24.11.2019", "14:00", "15:00", "0-06", "profesor");
    var nesto9= new Kalendar.vanredna("06.11.2019", "14:00", "15:00", "1-03", "profesor");
    var nesto10= new Kalendar.vanredna("01.11.2019", "14:00", "15:00", "1-03", "profesor");
    var nesto11= new Kalendar.vanredna("02.11.2019", "14:00", "15:00", "1-03", "profesor");
    var nesto12= new Kalendar.vanredna("03.11.2019", "14:00", "15:00", "1-03", "profesor");
    var nesto13= new Kalendar.vanredna("04.11.2019", "14:00", "15:00", "1-03", "profesor");
    var nesto14= new Kalendar.vanredna("05.11.2019", "14:00", "15:00", "1-03", "profesor");
    var nizPeriodicnih=[nesto1, nesto2, nesto3, nesto0, nesto7, nesto8];
    var nizVanrednih=[nesto4, nesto5, nesto6,nesto10,nesto11,nesto12,nesto13,nesto14,nesto9];
    Kalendar.ucitajPodatke(nizPeriodicnih, nizVanrednih);
}