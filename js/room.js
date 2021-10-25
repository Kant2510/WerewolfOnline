import {get, child, ref, onValue, remove, onDisconnect, update } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { database } from "../js/connect.js";

var btn_logout = document.getElementById("button-logout");
var stt = 0,
    tbody = document.getElementById("tbody");
var list_data = [];
var divlist = document.getElementById("list");
var color = ["#E8F89D", "#8D110A", "#7A8DE5", "#9466DE", "#69A899", "#CD982F",
    "#8A2BE2", "#69A33D", "#FFD700", "#87CEEB", "#FFE4E1", "#7C6A49", "#B76300",
    "#DB7093", "#B3263E", "#C1AE6B", "#DE6C34", "#FE9BA4", "#978964", "#282E0C",
    "#391E46", "#EB7589"
];

function generateAvatar(text, foregroundColor = "white", backgroundColor = "black") {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 25;
    canvas.height = 25;

    // Draw background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = "bold 20px Assistant";
    context.fillStyle = foregroundColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
}
//hàm này để in biệt danh, vai trò ra bảng
function printdata(name) {
    /*let trow = document.createElement("tr");
    let row1 = document.createElement("td");
    let row2 = document.createElement("td");
    //let row3 = document.createElement("td");

    row1.innerHTML = ++stt;
    row2.innerHTML = name;
    //row3.innerHTML = role;
    
    trow.appendChild(row1);
    trow.appendChild(row2);
    //trow.appendChild(row3);

    tbody.appendChild(trow);*/
    var ul = document.createElement("ul");
    var member_avatar = document.createElement("li");
    var member_name = document.createElement("p");
    var rd = Math.floor(Math.random() * color.length);

    stt++;
    member_avatar.innerHTML = name.charAt(0);
    member_avatar.style.backgroundColor = color[rd];
    member_name.innerHTML = name;

    ul.appendChild(member_avatar);
    ul.appendChild(member_name);
    divlist.appendChild(ul);
}
//hàm này để in biệt danh, vai trò, mã phòng của người chơi
function printinfo(myname, myrole, myroom, nop) {
    document.getElementById("my-name").innerHTML = myname;
    document.getElementById("my-role").innerHTML = myrole;
    document.getElementById("my-room").innerHTML = myroom;
    onValue(ref(database, "RoomCreate/" + "Room: " + localStorage.id + "/RoleList"), snapshot => {
        var numnow = snapshot.val() == null ? 0 : snapshot.val().length;
        document.getElementById("numbers-of-people").innerHTML = nop + "/" + numnow;
    });
    infoofrole(myrole);
}

function infoofrole(myrole) {
    switch (myrole) {
        case "Ma Sói":
            document.getElementById("info-of-role").innerHTML = "Vào ban đêm, ma sói sẽ tỉnh dậy cùng nhau và thống nhất thịt một nạn nhận nào đó. Sói có thể không giết người nào và không được giết sói khác.";
            break;
        case "Dân Làng":
            document.getElementById("info-of-role").innerHTML = "Ngủ suốt đêm. Tham gia bàn luận tìm sói (hoặc tự hủy vì giết nhầm phe) vào ban ngày.";
            break;
        case "Tiên Tri":
            document.getElementById("info-of-role").innerHTML = "Mỗi đêm, tiên tri chỉ định một người. Quản trò sẽ cho tiên tri biết người đó có phải là ma sói hay không.";
            break;
        case "Cupid":
            document.getElementById("info-of-role").innerHTML = "Đêm đầu tiên ra hai người chơi trở thành cặp yêu nhau. Nếu một trong hai người này chết, người còn lại cũng sẽ chết vì yêu.";
            break;
        case "Thợ Săn":
            document.getElementById("info-of-role").innerHTML = "Khi bị chết trong đêm, thợ săn có quyền chọn thêm một người chơi khác chết cùng.";
            break;
        case "Phù Thủy":
            document.getElementById("info-of-role").innerHTML = "Phù thủy sẽ có hai bình thuốc. Một bình giết và một bình cứu. Trong đêm, quản trò sẽ cho phù Thủy biết ai sẽ bị cắn trong đêm và hỏi xem phù thủy có muốn sử dụng quyền năng nào hay không. Mỗi bình chỉ dùng một lần.";
            break;
        case "Bảo Vệ":
            document.getElementById("info-of-role").innerHTML = "Mỗi đêm, bảo vệ chọn một người khác hoặc chính mình để bảo vệ. Người chơi này sẽ bất tử vào đêm đó. Không bảo vệ một người hai đêm liền.";
            break;
        case "Thế Thân":
            document.getElementById("info-of-role").innerHTML = "Nếu số lượng phiếu bầu bằng nhau. Thế thân sẽ chết thay.";
            break;
        case "Bán Sói":
            document.getElementById("info-of-role").innerHTML = "Khi bị sói cắn sẽ không chết và biến thành sói vào đêm sau. Quản trò sẽ gọi để thế thân biết mình bị hóa thành sói.";
            break;
        case "Kẻ Bị Nguyền":
            document.getElementById("info-of-role").innerHTML = "Đêm đầu tiên chọn một người để chế áp lời nguyền. Nếu người đó chết hoặc bị treo cổ, đêm tiếp thep sẽ thành sói.";
            break;
        case "Luật Sư":
            document.getElementById("info-of-role").innerHTML = "Được bầu hai phiếu cùng một lúc. Khi bị biểu quyết sẽ biện hộ duy nhất một lần để hưởng án treo, nếu ngày tiếp theo không treo cổ được ma sói thì luật sư sẽ chết.";
            break;
        case "Hồn Bất Diệt":
            document.getElementById("info-of-role").innerHTML = "Sau khi chết có thể tham gia bỏ phiếu nhưng không được bàn luận.";
            break;
        case "Đổi Mệnh":
            document.getElementById("info-of-role").innerHTML = "Được kêu thứ nhất trong đêm đầu tiên, sẽ tự chọn thành ma sói hay dân làng.";
            break;
        case "Sói Thiên Thần":
            document.getElementById("info-of-role").innerHTML = "Khi bị chết thì sang đêm tiếp theo sẽ hóa thiên thần và có quyết định một lần duy nhất cứu người bị cắn hay không.";
            break;
        case "Sói Quỷ":
            document.getElementById("info-of-role").innerHTML = "Khi bị chết thì sang đêm tiếp theo sẽ hóa quỷ dữ và có giết thêm người nào đó một lần duy nhất.";
            break;
        case "Chưa bắt đầu":
            document.getElementById("info-of-role").innerHTML = "Chưa có vai trò.";
            break;
    }
}
//hàm này để lấy mã phòng hiện thời để kiếm phòng tương ứng
function printroompage() {
    //có được mã phòng hiện thời in ra dữ liệu phòng đó
    onValue(ref(database, "RoomsList/" + "Room: " + localStorage.id + "/"), snapshot => {
        //reset lại 3 biến dưới để không biết chồng chất
        list_data = [];
        stt = 0;
        //tbody.innerHTML = "";
        divlist.innerHTML = "";
        snapshot.forEach(childSnapshot => {
            list_data.push(childSnapshot.val());
        });
        list_data.forEach(element => {
            printdata(element.Name);
            //check tên nếu trùng thì in ra vai trò
            if (element.Name == localStorage.name) {
                localStorage.role = element.Role;
            }
            //check xem có đang chơi hay không để bật tắt nút rời phòng
            if (localStorage.role == "Chưa bắt đầu") {
                btn_logout.disabled = false;
            } else {
                btn_logout.disabled = true;
            }
            //(với liên kết) in ra biệt danh, mã phòng của người chơi
            printinfo(localStorage.name, localStorage.role, localStorage.id, stt);
        });
    });
    //kiểm tra có trong danh sách admin không
    onValue(ref(database, "RoomCreate/" + "Room: " + localStorage.id + "/"), snapshot => {
        var check_name_admin = [];
        snapshot.forEach(childSnapshot => {
            check_name_admin.push(childSnapshot.val());
        });
        if (localStorage.name == check_name_admin[0]) {
            update(ref(database, "RoomCreate/" + "Room: " + localStorage.id + "/"), {
                Admin: ""
            });
            localStorage.admin = true;
            window.location = "https://tuannhat.000webhostapp.com/admin.html";
        } else {
            localStorage.admin = false;
        }
    });
}

function logout() {
    remove(ref(database, "RoomsList/" + "Room: " + localStorage.id + "/" + localStorage.name));
    window.location = "https://tuannhat.000webhostapp.com/";
}

function getout() {
    //bung ra khi mất kết nối internet
    window.addEventListener('offline', () => logout());
    //bung ra và xóa đi thông tin của mình khi tắt tab, refresh tab
    onDisconnect(ref(database, "RoomsList/" + "Room: " + localStorage.id + "/" + localStorage.name)).remove(localStorage.name);
    get(child(ref(database), "RoomsList/" + "Room: " + localStorage.id + "/" + localStorage.name)).then((snapshot) => {
        if (!snapshot.exists()) {
            window.location = "https://tuannhat.000webhostapp.com/";
        }
    });
}
//printdata("Đang load...");
printinfo("Đang load...", "Đang load...", "Đang load...", "... ");
/*Lấy Các Phần Tử Trong Thẻ DOM*/
let tabHeader = document.getElementsByClassName("tab-header")[0];
let tabIndicator = document.getElementsByClassName("tab-indicator")[0];
let tabBorder = document.getElementsByClassName("tab-border")[0];
let tabBody = document.getElementsByClassName("tab-body")[0];
let tabsPane = tabHeader.getElementsByTagName("div");
/*Thực Hiện Vòng Lặp*/
for (let i = 0; i < tabsPane.length; i++) {
    tabsPane[i].addEventListener("click", function() {
        tabHeader.getElementsByClassName("active")[0].classList.remove("active");
        tabsPane[i].classList.add("active");
        tabBody.getElementsByClassName("active")[0].classList.remove("active");
        tabBody.getElementsByTagName("div")[i].classList.add("active");
        tabIndicator.style.left = `calc(calc(100% / (100/35)) * ${i})`;
        tabBorder.style.left = `calc(calc(100% / (100/35)) * ${i})`;
    })
}
window.onload = printroompage();
window.onload = getout();
btn_logout.addEventListener('click', logout);