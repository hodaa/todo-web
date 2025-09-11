(function (window) {
	'use strict';

    const taskInput = document.getElementById("taskInput");
	taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();  
        const title = e.target.value.trim();
        if (!title) return;

        fetch("tasks/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 "X-CSRFToken": getCookie("csrftoken") 
            },
            body: JSON.stringify({title: title})
        })
        .then(res => res.json())
        .then(data => {
		    const ul = document.getElementById("task-list");
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="view">
                    <input class="toggle" type="checkbox">
                    <label></label>
                    <button class="destroy"></button>
                </div>
                <input class="edit">
            `;
            li.querySelector("label").textContent = data.title;
            li.querySelector("input.edit").value = data.title;
            ul.prepend(li);
            taskInput.value = '';
        }).catch(err => {
            alert("Failed to add task: " + err.message);
        })
    }
});
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

})(window);
