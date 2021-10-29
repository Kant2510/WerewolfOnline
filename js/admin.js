import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { database } from "../js/connect.js";



var btn_start = document.getElementById("button-start"),
    btn_end = document.getElementById("button-end");

//var name_admin_next = document.getElementById("name_admin_next"), btn_out = document.getElementById("button-out"), btn_logout = document.getElementById("button-logout");

var stt = 0,
    tbody = document.getElementById("tbody");
var list_data = [];
var list_name_object = [],
    list_name_string = [],
    list_role = [];
//hàm này để in biệt danh, vai trò ra bảng
function printdata(name, role) {
    let trow = document.createElement("tr");
    let row1 = document.createElement("td");
    let row2 = document.createElement("td");
    let row3 = document.createElement("td");
    let row4 = document.createElement("td");

    row1.innerHTML = ++stt;
    row2.innerHTML = name;
    row3.innerHTML = role;
    row4.innerHTML = "&#xf079;";

    row1.classList.add("stt");
    row4.value = name;
    row4.classList.add("fas");

    trow.appendChild(row1);
    trow.appendChild(row2);
    trow.appendChild(row3);
    trow.appendChild(row4);

    tbody.appendChild(trow);
}
//hàm này để in biệt danh, vai trò, mã phòng của người chơi ra bảng
function printinfo(myroom, nop) {
    onValue(ref(database, "RoomCreate/" + "Room: " + localStorage.id + "/RoleList"), snapshot => {
        var numnow = snapshot.val() == null ? 0 : snapshot.val().length;
        document.getElementById("numbers-of-people").innerHTML = "Số lượng người chơi: " + nop + "/" + numnow;
    });
    document.getElementById("my-room").innerHTML = "Phòng: " + myroom;
}
//hàm này để lấy mã phòng hiện thời để kiếm phòng tương ứng
function printroompage() {

    //có được mã phòng hiện thời in ra dữ liệu phòng đó
    onValue(ref(database, "RoomsList/" + "Room: " + localStorage.id), snapshot => {
        list_data = [];
        snapshot.forEach(childSnapshot => {
            list_data.push(childSnapshot.val());
        });
        stt = 0;
        tbody.innerHTML = "";
        list_data.forEach(element => {
            //in bảng cho admin
            printdata(element.Name, element.Role);
        });
        //(với liên kết) in ra biệt danh, vai trò, mã phòng của người chơi
        printinfo(localStorage.id, stt);

    });
    //bật tắt nút start khi phòng đủ hoặc thiếu
    start_end();
}

function start_end() {
    var a_length;
    onValue(ref(database, "RoomCreate/" + "Room: " + localStorage.id + "/RoleList"), snapshot => {
        a_length = snapshot.val() == null ? 0 : snapshot.val().length;
    });
    onValue(ref(database, "RoomsList/" + "Room: " + localStorage.id), snapshot => {
        var b_length = snapshot.val() == null ? 0 : Object.keys(snapshot.val()).length;
        if (a_length > b_length) {
            btn_start.disabled = true;
            btn_end.disabled = true;
            //btn_logout.disabled = false;
            document.getElementsByClassName("swap").disabled = false;
        } else {
            btn_start.disabled = false;
            btn_end.disabled = true;
            //btn_logout.disabled = false;
            document.getElementsByClassName("swap").disabled = false;
        }
    });
}
//hàm này để lấy dữ liệu tên và vai trò để random
function getdata() {
    onValue(ref(database, "RoomsList/" + "Room: " + localStorage.id), snapshot => {
        list_name_object = [], list_name_string = [];
        snapshot.forEach(childSnapshot => {
            list_name_object.push(childSnapshot.val());
        });
        list_name_object.forEach(element => {
            list_name_string.push(element.Name);
        });
    });
    onValue(ref(database, "RoomCreate/" + "Room: " + localStorage.id + "/RoleList"), snapshot => {
        list_role = snapshot.val();
    });
}

function random() {
    let currentIndex = list_role.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [list_role[currentIndex], list_role[randomIndex]] = [
            list_role[randomIndex], list_role[currentIndex]
        ];
    }
    for (var i = 0; i < list_role.length; i++) {
        update(ref(database, "RoomsList/" + "Room: " + localStorage.id + "/" + list_name_string[i]), {
            Role: list_role[i]
        });
    }
    btn_start.disabled = true;
    btn_end.disabled = false;
    //btn_logout.disabled = true;
    document.getElementsByClassName("swap").disabled = true;
}

function end() {
    //kết thúc đưa vai trò về ban đầu
    for (var i = 0; i < list_role.length; i++) {
        update(ref(database, "RoomsList/" + "Room: " + localStorage.id + "/" + list_name_string[i]), {
            Role: "Chưa bắt đầu"
        });
    }
    btn_start.disabled = false;
    btn_end.disabled = true;
    //btn_logout.disabled = false;
    document.getElementsByClassName("swap").disabled = false;
}

if (localStorage.admin == "false" || localStorage.admin == undefined) {
    alert("Bạn không đủ nhân phẩm để vào đây!")
    window.location = "https://tuannhat.000webhostapp.com/";
}
printdata("Đang load...", "Chưa bắt đầu");
printinfo("Đang load...", "... ");
getdata();
/*let tabHeader = document.getElementsByClassName("tab-header")[0];
let tabIndicator = document.getElementsByClassName("tab-indicator")[0];
let tabBorder = document.getElementsByClassName("tab-border")[0];
let tabBody = document.getElementsByClassName("tab-body")[0];
let tabsPane = tabHeader.getElementsByTagName("div");*/
document.addEventListener("click", (event) => {
    if (list_name_string.includes(event.target.value) && document.getElementsByClassName("swap").disabled == false) {
        update(ref(database, "RoomCreate/" + "Room: " + localStorage.id + "/"), {
            Admin: event.target.value
        });
        localStorage.admin = false;
        window.location = "https://tuannhat.000webhostapp.com/";
    } else if (list_name_string.includes(event.target.value) && document.getElementsByClassName("swap").disabled == true) {
        alert("Trò chơi đang diễn ra! Không thể đổi mode");
    }
});
window.onload = printroompage();
btn_end.addEventListener("click", end);
btn_start.addEventListener("click", random);
/////////////////////////////////////////////