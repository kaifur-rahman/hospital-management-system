//hiding tick
$("#docTick").hide();
$("#patTick").hide();
//making user select option
//doctor selected
document.getElementById("doctorSelected").addEventListener("click",function(){
  document.getElementById("doctorSelected").classList.add("optionBoxSelected");
  document.getElementById("patientSelected").classList.remove("optionBoxSelected");
  document.getElementById("optionSelected").value="userDoctor";
  $("#docTick").show();
  $("#patTick").hide();

});
//patient selected
document.getElementById("patientSelected").addEventListener("click",function(){
  document.getElementById("patientSelected").classList.add("optionBoxSelected");
  document.getElementById("doctorSelected").classList.remove("optionBoxSelected");
  document.getElementById("optionSelected").value="userPatient";
  $("#patTick").show();
  $("#docTick").hide();

});
