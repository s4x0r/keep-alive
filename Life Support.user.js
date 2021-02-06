// ==UserScript==
// @name         Life Support
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  keeps threads alive
// @author       s4x0r
// @match        https://boards.4chan.org/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    'use strict';



    var checker;
    var buttonbool = false;
    var pagelimit = 10;
    var checktimer = 30000;
    var subbutton;
    var submitter;
    var hidebool = true;

    var floatdiv =`
<div id="floatdiv">
  <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
  <div id="floatdivheader">
    <input type="button" value="show" id="hidebox">
  </div>
  <div id="floatdivbody" style="display:none">
    <form>
      <label for='keepalive'>keep alive:</label>
      <input type="button" value="false" id="keep-alive">
      <br>
      <label for='pagelimit'>Bump on page:</label>
      <select id='pagelimit' name='pagelimit'>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
      <span id="limitdisplay">10</span>
      <br>
      <br>
      <textarea name="queuebox" id="queuebox" rows="10" cols="30" style="background-color:#1A1B1D; color:#c5c8c6;"></textarea>
      <br>
      <input type="button" value="queue posts" id="queue">
      <label for='s4xseparator'>separator</label>
      <select id='s4xseparator' name='separator'>
        <option value="|">pipe</option>
        <option value="\n">newline</option>
        <option value="\t">tab</option>
        <option value=",">comma</option>
      </select>
    </form>
  </div>
</div>
    `;


    //$('body').append('<input type="button" value="false" id="keep-alive">')
    $('body').append(floatdiv)
    $('#floatdiv').css('position', 'fixed').css('z-index',9).css('background-color','#282A2E').css('border','1px solid #d3d3d3').css("top",50).css("left", 1000)
    $('#floatdivheader').css('padding', '10px').css('cursor','move').css('z-index',10).css('background-color', '#2196f3').css('color','#fff')
    //$("#keep-alive").css("position", "fixed").css("top",30).css("left", 0);
    $("#keep-alive").click(function(){setbutton();});
    $("#pagelimit").click(function(){setpagelimit();});
    $("#hidebox").click(function(){hidebox();});
    $("#queue").click(function(){queuebutton();});

    //var subbutton = $()
    //'input')[subbutton].style.display='none';


    function findsub(){
        var x = $('input');
        var i;
        for(i=0;i<x.length;i++){
            if (x[i].type=='submit'&&x[i].value=='Submit'){
                subbutton = x[i];
            }
        }
    }

    function setbutton(){
        buttonbool = !buttonbool;
        if (!subbutton){
            findsub();
        }
        document.getElementById('keep-alive').value=buttonbool;
        if (buttonbool){
            checker = setInterval(checkpage,checktimer);
        }else{
            clearInterval(checker);
        }
    }

    function checksubmit(){
        if (subbutton.value.search('Auto') != -1){
            subbutton.click();
            clearInterval(submitter);
        }
    }

    function checkpage(){
        if ($("#page-count").text()>=pagelimit){
            subbutton.click();
            submitter = setInterval(checksubmit,5000);
        }
    }

    function setpagelimit(){
        pagelimit=document.getElementById("pagelimit").value;
        console.log(pagelimit)
        document.getElementById("limitdisplay").innerHTML=pagelimit;
    }

    function hidebox(){
        var boxbody = document.getElementById("floatdivbody");
        var hidebox = document.getElementById("hidebox");
        hidebool = !hidebool
        if(hidebool){
            hidebox.value = "show";
            boxbody.style.display="none";
        }else{
            hidebox.value = "hide";
            boxbody.style.display="inline";
        }
    }

    function queuebutton(){
        var combox;
        var addbutton =document.getElementById("add-post")
        var x = $('.field');
        var i;
        for(i=0;i<x.length;i++){
            if(x[i].placeholder=="Comment"){
                combox = x[i];
            }
        }

        var lst=document.getElementById("queuebox").value.split(document.getElementById('s4xseparator').value)

        var j;
        for(j=0;j<lst.length;j++){
            //console.log(lst[j])
            combox.value=lst[j]
            setTimeout(addbutton.click(), 1000);
        }
    }


    // Make the DIV element draggable:
    dragElement(document.getElementById("floatdiv"));

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
})();