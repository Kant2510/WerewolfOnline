import { ref, get, set, child, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { database } from "../js/connect.js";

var modal = document.getElementById('myModal');
var btn_admin = document.getElementById("button-admin"),
    btn_create = document.getElementById("button-create");
var span = document.getElementsByClassName("closebtn")[0];


var id_create = document.getElementById("idroom");
var list_input_idofrole = ["wolf", "villager", "seeker", "cupid", "hunter", "witch", "guard", "substitute", "villolf", "cursed", "lawyer", "soul", "changer", "angel", "devil"];

var list_decrease = ["decrease-wolf", "decrease-villager", "decrease-seeker", "decrease-cupid", "decrease-hunter", "decrease-witch",
    "decrease-guard", "decrease-substitute", "decrease-villolf", "decrease-cursed", "decrease-lawyer", "decrease-soul", "decrease-changer", "decrease-angel", "decrease-devil"
];

var list_increase = ["increase-wolf", "increase-villager", "increase-seeker", "increase-cupid", "increase-hunter", "increase-witch",
    "increase-guard", "increase-substitute", "increase-villolf", "increase-cursed", "increase-lawyer", "increase-soul", "increase-changer", "increase-angel", "increase-devil"
];

var list_role = ["Ma Sói", "Dân Làng", "Tiên Tri", "Cupid", "Thợ Săn", "Phù Thủy", "Bảo Vệ", "Thế Thân", "Bán Sói", "Kẻ Bị Nguyền", "Luật Sư", "Hồn Bất Diệt", "Đổi Mệnh", "Sói Thiên Thần", "Sói Quỷ"];
var num_of_roles = [],
    database_role = [];
var list_room_object = [],
    list_room_string = [];

//nhấn nút hiện/ẩn modal
btn_admin.onclick = function() {
    modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function checkcreate() {
    if (database_role.length >= 3) {
        get(child(ref(database), "RoomCreate")).then(() => {
            checkroomcreate();
        });
    } else {
        document.getElementById("alert2").innerHTML = "*Số lượng người chơi quá ít (3 người trở lên)!";
    }
}

function checkroomcreate() {
    if (!list_room_string.includes(id_create.value)) {
        //Tạo phòng mới gồm mã phòng và danh sách vai trò trong RoomCreate
        set(ref(database, "RoomCreate/" + "Room: " + id_create.value + "/"), {
            Room: id_create.value,
            RoleList: database_role,
            Admin: ""
        });
        //lưu dữ liệu hiện thời: mp
        localStorage.id = id_create.value;
        localStorage.admin = true;
        gotoadmin();
    } else if (list_room_string.includes(id_create.value)) {
        document.getElementById("alert2").innerHTML = "*Phòng đã có! Không thể tạo thêm!";
    }
}
//Hàm này để tạo phòng
function create() {
    //tạo danh sách gồm cái vai trò và số lượng
    num_of_roles = [], database_role = [];
    for (var i = 0; i < list_role.length; i++) {
        num_of_roles.push(document.getElementById(list_input_idofrole[i]).value);
        for (var j = 0; j < num_of_roles[i]; j++) {
            database_role.push(list_role[i]);
        }
    }
    update();
    checkcreate();
}

function gotoadmin() {
    document.getElementById("alert2").style.color = "green";
    document.getElementById("alert2").innerHTML = "Đã tạo phòng thành công!\n" + "Mã phòng là: " + id_create.value;
    setTimeout(() => {
        window.location = "https://tuannhat.000webhostapp.com/admin.html";
    }, 2000);
}

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
document.addEventListener("click", (event) => {
    if (list_decrease.includes(event.target.id)) {
        var value = parseInt(document.getElementById(list_input_idofrole[list_decrease.indexOf(event.target.id)]).value, 10);
        //value = isNaN(value) ? 0 : value;
        value = value < 1 ? 1 : value;
        value--;
        document.getElementById(list_input_idofrole[list_decrease.indexOf(event.target.id)]).value = value;
    }
    if (list_increase.includes(event.target.id)) {
        var value = parseInt(document.getElementById(list_input_idofrole[list_increase.indexOf(event.target.id)]).value, 10);
        //value = isNaN(value) ? 0 : value;
        value = value > 9 ? 9 : value;
        value++;
        document.getElementById(list_input_idofrole[list_increase.indexOf(event.target.id)]).value = value;
    }
});
btn_create.addEventListener("click", create);
/////////////////////////////////////////////