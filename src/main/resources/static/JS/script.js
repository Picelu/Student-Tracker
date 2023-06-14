var bubbles = document.querySelectorAll(".student-bubble");

function handleDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text/plain");
  var draggedBubble = document.getElementById(data);
  var targetBubble = event.target.closest(".student-bubble");

  if (targetBubble) {
    // Swap the positions of the dragged bubble and the target bubble
    targetBubble.parentNode.insertBefore(
      draggedBubble,
      targetBubble.nextSibling
    );
  }
}

function handleClick() {
  this.classList.toggle("expanded");
}

function handleDragEnd(event) {
  var bubble = event.target;
  var container = bubble.parentNode;
  var rect = container.getBoundingClientRect();
  var xPos = event.clientX - rect.left - bubble.offsetWidth / 2;
  var yPos = event.clientY - rect.top - bubble.offsetHeight / 2;

  bubble.style.transform = `translate(${xPos}px, ${yPos}px)`;
}

bubbles.forEach(function (bubble) {
  bubble.addEventListener("dragstart", handleDragStart);
  bubble.addEventListener("dragover", handleDragOver);
  bubble.addEventListener("drop", handleDrop);
  bubble.addEventListener("click", handleClick);
  bubble.addEventListener("dragend", handleDragEnd);
});

function editUser(event, id) {
  console.log(id);
  event.stopPropagation();
  const endpoint = `/users/${id}`;

  const form = document.createElement("form");

  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Name:";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = "name";

  const emailLabel = document.createElement("label");
  emailLabel.textContent = "Email:";
  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.name = "email";

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Save";

  form.appendChild(nameLabel);
  form.appendChild(nameInput);
  form.appendChild(emailLabel);
  form.appendChild(emailInput);
  form.appendChild(submitButton);

  // Fetch the existing student data
  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      // Prepopulate the input fields with the existing data
      nameInput.value = data.name;
      emailInput.value = data.email;
    })
    .catch((error) => {
      console.error("Failed to fetch student data:", error);
      // Handle error while fetching student data
    });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const updatedUser = {
      name: nameInput.value,
      email: emailInput.value,
    };

    fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => {
        if (response.ok) {
          console.log("User successfully edited");
          location.reload(); // Refresh the page after successful edit
        } else {
          console.error("Failed to edit user");
          // Handle edit error
        }
      })
      .catch((error) => {
        console.error("Failed to edit user:", error);
        // Handle edit error
      });
  });

  document.body.appendChild(form);
}

function deleteUser(id) {
  const endpoint = `/users/del/${id}`;
  console.log(id);
  console.log(endpoint);

  if (confirm("Are you sure you want to delete this user?")) {
    fetch(endpoint, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("User successfully deleted");
          location.reload();
        } else {
          console.error("Failed to delete user");
        }
      })
      .catch((error) => {
        console.error("Failed to delete user:", error);
      });
  }
}
