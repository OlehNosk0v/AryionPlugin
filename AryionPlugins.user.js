// ==UserScript==
// @name         AryionPlugins
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  A simple script for easy viewing of artwork and comics.
// @license      MIT
// @author       OlehNoskov
// @homepage     https://github.com/OlehNosk0v/AryionPlugin
// @updateURL    https://github.com/OlehNosk0v/AryionPlugin/raw/main/AryionPlugins.user.js
// @downloadURL  https://github.com/OlehNosk0v/AryionPlugin/raw/main/AryionPlugins.user.js
// @match        https://aryion.com/g4/view/*
// @include      https://aryion.com/g4/view/*
// ==/UserScript==

// Many thanks to Vore Witch for helping with the script!

var index, len;

const DownloadComicPage = async () => {
    const downloadLink = getDownloadLink()
    const image = await (await fetch(downloadLink)).blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(image);
    let title = await (document.getElementsByClassName('user-link')[1]).textContent+" - ";
    let ID = localStorage.getItem("ID")
    if (ID === "true") {
        title += await document.querySelectorAll("div > a")[2].href.split("=")[1]+" - ";
    }
    title += await (document.getElementsByClassName('g-box-title')[1]).textContent.replace("/", "-")
    link.download = title;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

const CheckCapthca = async () => {
    await delay(100)
    //let CheckBox = document.querySelectorAll("head > title")[0].textContent
    let CheckBox = document.body.className
    if (CheckBox == "no-js") {
        console.log("CLOUDFLARE")
        return true;
    }
    else {
        return false;
    }
}

const DownloadComics = async () =>{
    let i = Number(document.getElementById("PagesComics").value)-1;
    if (i >= 0){
        localStorage.setItem((document.getElementsByClassName('user-link')[1]).textContent, i);
        await DownloadComicPage();
        getNextButton().click()
    }
}

const getDownloadLink = () => {
     const button = document.querySelectorAll("div > a");
     len = button.length
     for (index = 0; index < len; ++index){
         if(button[index].innerText == "Download"){
             return button[index].href;
         }
     }
}

const getNextButton = () => {
     let button = document.getElementById("next-link")
     if (!button){
         //let buttons = document.querySelectorAll("div > a");
         let buttons = document.querySelectorAll("a.g-button.g-corner-all");
          for (let i = 0; i < buttons.length - 1; i++){
              if(buttons[i].innerHTML == "Next &gt;" || buttons[i].innerText == "Next >"){
               button = buttons[i];
               break;
              }
          }
      }
    if (!button){
        let buttons = document.querySelectorAll("div > a");
        for (let i = 0; i < buttons.length - 1; i++){
              if(buttons[i].innerHTML == "Next &gt;" || buttons[i].innerText == "Next >"){
               button = buttons[i];
               break;
              }
          }
    }
    return button
}



//console.log("...Start")

document.addEventListener('keydown', function(event) {
  let button = null;
  if( event.target.nodeName == "INPUT" || event.target.nodeName == "TEXTAREA" ) return;
  if (event.code == 'ArrowRight') {
      button = getNextButton()
  }
  else if (event.code == 'ArrowLeft'){
     button = document.getElementById("prev-link")
      if (button == null){
          button = document.querySelectorAll("div > a");
          len = button.length
          for (index = 0; index < len; ++index){
              if(button[index].innerHTML == "&lt; Prev"){
               button = button[index];
                  break;
              }
          }
      }
  }
  else if (event.shiftKey && event.keyCode == 68){
      void DownloadComicPage();
  }
  else if (event.shiftKey && event.keyCode == 70) {
     button = document.getElementById("fav-link")
  }
  if(button){
     button.click();
  }
});
if (await CheckCapthca()){
    return true;
}
else {
const authorName = (document.getElementsByClassName('user-link')[1]).textContent
const input = document.createElement("input");
input.type = "number";
input.value = Number(localStorage.getItem(authorName));
input.id = "PagesComics";
let fragment = document.getElementsByClassName('func-box')[0];

const DivBlock = document.createElement("div");
DivBlock.setAttribute('style','display:flex;');
const checkBox = document.createElement("input");
checkBox.type = "checkbox";
checkBox.value = "ID image";
checkBox.value = "s";
let ID = localStorage.getItem("ID")
if (ID == null) {
    localStorage.setItem("ID",false);
}
if (ID === "true") {
 checkBox.checked = true;
} else {
    checkBox.checked = false;
}

checkBox.addEventListener('change', function() {
        if(this.checked) {
            localStorage.setItem("ID",true);
        } else {
            console.log("aaaa")
            localStorage.setItem("ID", false)
        };
    });
const text = document.createElement("div");
text.innerHTML = "ID Image";



const buttoninput = document.createElement("input");
buttoninput.type = "button";
buttoninput.id = "BUTTONDOWN"
buttoninput.value = "Download";

fragment.appendChild(input);
DivBlock.appendChild(checkBox);
DivBlock.appendChild(text);
fragment.appendChild(DivBlock);
fragment.appendChild(buttoninput);

fragment.setAttribute('style','display:flex;; text-align: center; justify-content: center; grid-column-gap: 5px;')

fragment = document.getElementsByClassName('func-box')[0];

}


document.getElementById('BUTTONDOWN').onclick = async () => {
   await DownloadComics();
};

const blockPage = () => {
    const waitBanner = document.createElement('div');
    waitBanner.setAttribute('style', 'z-index: 999999999; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #00000055; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 300%; text-shadow: 0 0 25px #000')
    waitBanner.innerText = 'Wait please, comic is downloading...'
    waitBanner.id = "BlockPage";
    document.querySelector('html').setAttribute('style', 'height: 100%; overflow: hidden')
    document.body.appendChild(waitBanner);
}

async function delay(ms) {
  return await new Promise(resolve => setTimeout(resolve, ms));
}

const beginPage = async () => {
    console.log("Start")
    if (await CheckCapthca()) {
        console.log("Capthca")
        return;
    }
    let nextButton = await getNextButton();
    let tryi = 0;
    for (let tryi = 0; tryi < 30; ++tryi){
        await delay(100)
        nextButton = await getNextButton();
        if (nextButton){
            break;
        }
    }
    const pagesToDownload = Number(localStorage.getItem((document.getElementsByClassName('user-link')[1]).textContent))
    //console.log(pagesToDownload)
    //console.log("start")
    if (pagesToDownload > 0) {
        //console.log(nextButton)
        await delay(1000)
        if (!nextButton || nextButton === null) {
           //console.log(nextButton);
           localStorage.setItem((document.getElementsByClassName('user-link')[1]).textContent, 0);
        } else {
            localStorage.setItem((document.getElementsByClassName('user-link')[1]).textContent, pagesToDownload - 1);
        }
        if (nextButton && pagesToDownload >= 0) {
            blockPage();
        }
        console.log('working...')
        await DownloadComicPage();
        if (nextButton){
            nextButton.click()
        }
    }
}

const myTimeout = setTimeout(beginPage, 500);
