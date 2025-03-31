document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector("#grid-container");
    const addBox = document.querySelector(".add-box");

    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        alert("No user is logged in. Please log in first.");
        window.location.href = "./index.html";
        return;
    }

    // Retrieve user data with boxes from localStorage
    let userData = JSON.parse(localStorage.getItem("allUsers")) || {};
    let boxData = userData[loggedInUser]?.boxes || [];
    let boxCount = boxData.length ? Math.max(...boxData.map(box => box.id)) + 1 : 1;

    function createBox(id, name) {
        const newBox = document.createElement("div");
        newBox.classList.add("box");
        newBox.textContent = name;
        newBox.dataset.id = id;

        const menu = document.createElement("div");
        menu.classList.add("menu");
        menu.innerHTML = "⋮";

        const menuOptions = document.createElement("div");
        menuOptions.classList.add("menu-options");
        menuOptions.innerHTML = `<div class="rename">Rename</div><div class="delete">Delete</div>`;

        menu.appendChild(menuOptions);
        newBox.appendChild(menu);
        container.insertBefore(newBox, addBox);

        menu.onclick = (e) => {
            e.stopPropagation();
            menuOptions.style.display = menuOptions.style.display === "block" ? "none" : "block";
        };

        menuOptions.querySelector(".rename").onclick = (e) => {
            e.stopPropagation();
            renameBox(id, newBox);
            menuOptions.style.display = "none";
        };

        menuOptions.querySelector(".delete").onclick = (e) => {
            e.stopPropagation();
            deleteBox(id, newBox);
            menuOptions.style.display = "none";
        };

        newBox.onclick = () => openPasswordModal(id, newBox.textContent);

        document.addEventListener("click", function (event) {
            if (!menu.contains(event.target)) {
                menuOptions.style.display = "none";
            }
        });
    }

    function renameBox(id, boxElement) {
        let newName = prompt("Enter new name:");
        if (newName) {
            boxElement.textContent = newName;
            const menu = boxElement.querySelector(".menu");
            boxElement.appendChild(menu);

            let index = boxData.findIndex(box => box.id === id);
            if (index !== -1) {
                boxData[index].name = newName;
                userData[loggedInUser].boxes = boxData;
                localStorage.setItem("allUsers", JSON.stringify(userData)); // Save the updated box name
            }

            const modalTitle = document.getElementById("modal-box-name");
            if (modalTitle.dataset.id == id) {
                modalTitle.textContent = newName;
            }
        }
    }

    function deleteBox(id, boxElement) {
        if (confirm("Are you sure you want to delete this box?")) {
            container.removeChild(boxElement);
            boxData = boxData.filter(box => box.id !== id);
            userData[loggedInUser].boxes = boxData;
            localStorage.setItem("allUsers", JSON.stringify(userData)); // Save the updated box data
            localStorage.removeItem(`password_${loggedInUser}_${id}`);
        }
    }

    function openPasswordModal(id, name) {
        let modalTitle = document.getElementById("modal-box-name");
        modalTitle.textContent = name.replace("Rename", "").replace("Delete", "").trim();
        modalTitle.dataset.id = id;

        let storedPassword = localStorage.getItem(`password_${loggedInUser}_${id}`);
        document.getElementById("current-password").textContent = storedPassword ? storedPassword : "No password set";

        document.getElementById("password-input").value = "";
        document.getElementById("password-modal").classList.remove("hidden");

        document.getElementById("save-password").onclick = function () {
            const password = document.getElementById("password-input").value;
            if (password.trim() !== "") {
                localStorage.setItem(`password_${loggedInUser}_${id}`, password);
                document.getElementById("current-password").textContent = password;
                alert("Password saved!");
            } else {
                alert("Password cannot be empty.");
            }
        };

        document.getElementById("delete-password").onclick = function () {
            localStorage.removeItem(`password_${loggedInUser}_${id}`);
            document.getElementById("current-password").textContent = "No password set";
            document.getElementById("password-input").value = "";
            alert("Password deleted!");
        };
    }

    function closeModal() {
        document.getElementById("password-modal").classList.add("hidden");
    }

    document.getElementById("close-modal").onclick = closeModal;

    boxData.forEach(box => createBox(box.id, box.name));

    addBox.addEventListener("click", function () {
        let boxName = "Box" + boxCount;
        createBox(boxCount, boxName);
        boxData.push({ id: boxCount, name: boxName });
        userData[loggedInUser].boxes = boxData;
        localStorage.setItem("allUsers", JSON.stringify(userData)); // Save the new box
        boxCount++;
    });

    document.getElementById("toggle-password").addEventListener("click", function () {
        const passwordInput = document.getElementById("password-input");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            this.textContent = "Hide";
        } else {
            passwordInput.type = "password";
            this.textContent = "Show";
        }
    });
});
