document.addEventListener("DOMContentLoaded", function () {
    const bucketList = document.getElementById("bucket-list");
    const form = document.getElementById("add-item-form");
    const input = document.getElementById("new-item");
    const categorySelect = document.getElementById("category");
    const prioritySelect = document.getElementById("priority");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const progressBadge = document.querySelector(".progress-badge");
    const toggleTheme = document.getElementById("toggle-theme");
    const filterButtons = document.querySelectorAll(".filter-btn");

    function updateProgress() {
        let totalItems = document.querySelectorAll(".bucket-list li").length;
        let completedItems = document.querySelectorAll(".bucket-list li.completed").length;
        let percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        progressBar.value = percentage;
        progressText.textContent = `${percentage}% Completed`;
        progressBadge.textContent = `${percentage}% Completed`;
    }

    function toggleCompleted(event) {
        if (event.target.tagName === "SPAN") {
            event.target.parentElement.classList.toggle("completed");
            saveList();
            updateProgress();
        }
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let newItemText = input.value.trim();
        let category = categorySelect.value;
        let priority = prioritySelect.value;

        if (newItemText === "") return;

        let newItem = document.createElement("li");
        newItem.setAttribute("draggable", true);
        newItem.dataset.category = category;
        newItem.dataset.priority = priority;
        newItem.innerHTML = `<span>${newItemText} (${category})</span> <button class="delete-btn">❌</button>`;

        newItem.addEventListener("click", toggleCompleted);
        addTouchDragSupport(newItem);

        bucketList.appendChild(newItem);
        input.value = "";

        saveList();
        updateProgress();
    });

    bucketList.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-btn")) {
            e.target.parentElement.remove();
            saveList();
            updateProgress();
        }
    });

    function saveList() {
        let items = [];
        document.querySelectorAll(".bucket-list li").forEach(item => {
            items.push({
                text: item.textContent.replace("❌", "").trim(),
                category: item.dataset.category,
                priority: item.dataset.priority,
                completed: item.classList.contains("completed")
            });
        });
        localStorage.setItem("bucketList", JSON.stringify(items));
    }

    function addTouchDragSupport(item) {
        let touchStartY = 0;
        item.addEventListener("touchstart", function (e) {
            touchStartY = e.touches[0].clientY;
        });

        item.addEventListener("touchmove", function (e) {
            let touchEndY = e.touches[0].clientY;
            if (Math.abs(touchEndY - touchStartY) > 30) {
                let draggedItem = item;
                let parent = draggedItem.parentElement;
                let swapItem = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
                if (swapItem && swapItem.tagName === "LI") {
                    parent.insertBefore(draggedItem, swapItem);
                }
            }
        });
    }

    toggleTheme.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    function loadList() {
        let savedItems = JSON.parse(localStorage.getItem("bucketList")) || [];
        savedItems.forEach(item => {
            let newItem = document.createElement("li");
            newItem.setAttribute("draggable", true);
            newItem.dataset.category = item.category;
            newItem.dataset.priority = item.priority;
            newItem.innerHTML = `<span>${item.text} (${item.category})</span> <button class="delete-btn">❌</button>`;
            if (item.completed) newItem.classList.add("completed");

            newItem.addEventListener("click", toggleCompleted);
            addTouchDragSupport(newItem);

            bucketList.appendChild(newItem);
        });
        updateProgress();
    }

    loadList();
});
