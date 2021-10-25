import { ref, get, set, child, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { database } from "../js/connect.js";

var name = document.getElementById("name-box"),
    id = document.getElementById("id-box");

var btn_login = document.getElementById("button-login"),
    btn_admin = document.getElementById("button-admin");

var list_room_object = [],
    list_room_string = [];

var count_role = [],
    count_name = [];

function check() {
    get(child(ref(database), "RoomsList/" + "Room: " + id.value + "/" + name.value)).then(snapshot => {
        if (snapshot.exists()) {
            //alert("Biệt danh đã có! Không buồn lòng nhập thêm lần nữa!");
            document.getElementById("alert1").innerHTML = "*Biệt danh đã có! Không buồn lòng nhập thêm lần nữa!";
        } else {
            checkroom();
        }
    });
}

function checkroom() {
    var count_name_length = count_name == null ? 0 : Object.keys(count_name).length;
    if (list_room_string.includes(id.value) && count_role.length >= count_name_length + 1) {
        //lưu dữ liệu người chơi lên server
        set((ref(database, "RoomsList/" + "Room: " + id.value + "/" + name.value)), {
            Name: name.value,
            Role: "Chưa bắt đầu"
        });;
        //lưu dữ liệu hiện thời: bd, mp người chơi(liên kết với)
        localStorage.name = name.value;
        localStorage.id = id.value;
        localStorage.role = "Chưa bắt đầu";
        localStorage.admin = false;
        gotoroom()
    } else if (!list_room_string.includes(id.value)) {
        //alert("Sai mã phòng hoặc không có phòng! Không buồn lòng nhập thêm lần nữa!");
        document.getElementById("alert1").innerHTML = "*Sai mã phòng hoặc không có phòng! Không buồn lòng nhập thêm lần nữa!";
    } else if (count_role.length < count_name_length + 1) {
        //alert("Phòng đã đủ người!");
        document.getElementById("alert1").innerHTML = "*Phòng đã đủ người!";
    }
}
//Hàm này để tham gia phòng
function login() {
    btn_login.disabled = true;
    btn_admin.disabled = true;
    update();
    onValue(ref(database, "RoomCreate/" + "Room: " + id.value + "/RoleList"), snapshot => {
        count_role = snapshot.val();
    });
    onValue(ref(database, "RoomsList/" + "Room: " + id.value + "/"), snapshot => {
        count_name = snapshot.val();
    });
    //tìm xem đã có biệt danh hoặc có phòng hay chưa
    check();
}

function gotoroom() {
    document.getElementById("alert1").innerHTML = "";
    loading.style.display = "flex";
    setTimeout(() => {
        window.location = "https://tuannhat.000webhostapp.com/room.html";
    }, 3000);
}
//Hàm này để update list mã phòng để tìm kiếm id.value có trong list này không
function update() {
    onValue(ref(database, "RoomCreate"), (snapshot) => {
        snapshot.forEach(childSnapshot => {
            list_room_object.push(childSnapshot.val());
        });
        list_room_object.forEach(element => {
            list_room_string.push(element.Room);
        });
    });
}
btn_login.addEventListener("click", login);
/////////////////////////////////////////////
