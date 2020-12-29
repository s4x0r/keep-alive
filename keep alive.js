// ==UserScript==
// @name         Keep Alive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
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


    $('body').append('<input type="button" value="false" id="keep-alive">')
    $("#keep-alive").css("position", "fixed").css("top",30).css("left", 0);
    $("#keep-alive").click(function(){setbutton();});

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
})();
