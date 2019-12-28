var prviReq=true;

function myFunction(){
    Pozivi.ucitajSlike(prviReq);
    prviReq=false;
}

function prethodne(){
    prethodneSlike();

}
function prethodneSlike(){
    let ind=0;
    document.getElementsByClassName("dugme2")[0].disabled=false;
    for(let n=0;n<nizUcitanihSlika.length;n++){
        if((document.getElementById("slika1").src)==nizUcitanihSlika[n])ind=n;
    }
    ind-=3;
    document.getElementById("slika2").style.visibility = "visible";
    document.getElementById("slika3").style.visibility = "visible";
    document.getElementById("slika1").src=nizUcitanihSlika[ind];
    document.getElementById("slika2").src=nizUcitanihSlika[ind+1];
    document.getElementById("slika3").src=nizUcitanihSlika[ind+2];
    if(document.getElementById("slika1").src==nizUcitanihSlika[0])document.getElementsByClassName("dugme1")[0].disabled=true;

}
