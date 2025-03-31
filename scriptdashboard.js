document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector("#grid-container");
    const addBox = document.querySelector(".add-box");

    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert('No user is logged in. Please log in first.');
        window.location.href = "./index.html";
        return;
    }

    let boxData = JSON.parse(localStorage.getItem(`boxes_${loggedInUser}`)) || [];
    let boxCount = boxData.length ? Math.max(...boxData.map(box => box.id)) + 1 : 1; 

    
    function createBox(id, name) {
        const newBox = document.createElement("div");
        newBox.classList.add("box");
        newBox.textContent = name;
        newBox.dataset.id = id;

        
        newBox.addEventListener("click", function () {
            let newName = prompt("Rename your box:", newBox.textContent);
            if (newName) {
                newBox.textContent = newName;
                updateBoxInLocalStorage(id, newName);
            }
        });

        container.insertBefore(newBox, addBox.nextSibling);
    }

   
    boxData.forEach(box => createBox(box.id, box.name));


    addBox.addEventListener("click", function () {
        let boxName = "Box" + boxCount;
        createBox(boxCount, boxName);

        
        boxData.push({ id: boxCount, name: boxName });
        localStorage.setItem(`boxes_${loggedInUser}`, JSON.stringify(boxData));

        boxCount++;
    });

    
    function updateBoxInLocalStorage(id, newName) {
        let boxIndex = boxData.findIndex(box => box.id === id);
        if (boxIndex !== -1) {
            boxData[boxIndex].name = newName;
            localStorage.setItem(`boxes_${loggedInUser}`, JSON.stringify(boxData));
        }
    }
});
