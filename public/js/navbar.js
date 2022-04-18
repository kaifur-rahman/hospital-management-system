//toogle button color chnage
document.querySelector(".darkModeButton").addEventListener("click",changeBg);
function changeBg(){
  var value=document.querySelector(".darkModeButton").checked;
  if(value==true){
    document.querySelector(".darkModeButton").classList.add("btnOn");
    document.querySelector(".darkModeButton").classList.remove("btnOff");
  }else{
    document.querySelector(".darkModeButton").classList.add("btnOff");
    document.querySelector(".darkModeButton").classList.remove("btnOn");
  }
}
// /toggle button color change
