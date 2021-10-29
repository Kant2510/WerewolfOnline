import {ref, onValue, push} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { database } from "../js/connect.js";

var message = document.getElementById('mess');
var btn = document.getElementById("send");
var chat = document.getElementById("chat");

var open = document.getElementById('open');
var close = document.getElementById('close');

function send(){
    if(message.value == ""){
        //pass
    }
    else{
        btn.disabled = false;
        push((ref(database, "Message/" + "Room: " + localStorage.id)),{
            Message: message.value,
            Sender: localStorage.name
        });
        message.value = "";
    }
}
function receive(){
    onValue(ref(database, "Message/" + "Room: " + localStorage.id), snapshot => {
        document.getElementById("chat").innerHTML = ""
        snapshot.forEach(element => {
            var text = document.createElement("li");
            var name = document.createElement("li");
            var ul = document.createElement("ul");
            if(localStorage.name == element.val().Sender){
                text.innerHTML = element.val().Message;
                text.classList.add("owner");
            }
            else{
                name.innerHTML = element.val().Sender + ":";
                text.innerHTML =  element.val().Message;
                text.classList.add("not-owner");
            }
            ul.appendChild(name);
            ul.appendChild(text);
            chat.appendChild(ul);
        });
        if((chat.scrollTop + chat.clientHeight + 100 >= chat.scrollHeight)){
            chat.scrollTop = chat.scrollHeight;
        }
    });
}
open.onclick = function(){
    document.getElementById("input").classList.remove("close");
    document.getElementById("input").classList.add("open");
    document.getElementById("chat-frame").style.display = "block";
    document.getElementsByClassName("open-btn")[0].disabled = true;
    document.getElementsByClassName("close-btn")[0].disabled = false;
    chat.scrollTop = chat.scrollHeight;
}
close.onclick = function(){
    document.getElementById("input").classList.remove("open");
    document.getElementById("input").classList.add("close");
    document.getElementsByClassName("open-btn")[0].disabled = false;
    document.getElementsByClassName("close-btn")[0].disabled = true;
    setTimeout(() => {
        document.getElementById("chat-frame").style.display = "none";  
    }, 900);
}
window.onload = receive();
btn.addEventListener("click", send);
///////////////////////////////////