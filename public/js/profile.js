
document.addEventListener("DOMContentLoaded", function () {
  const itemNameInput = document.getElementById("input_text");
  const visitPageButton = document.getElementById("visitPageButton");

  const modalElems = document.querySelectorAll(".modal");
  const modalInstances = M.Modal.init(modalElems, {});
if(visitPageButton){
  visitPageButton.addEventListener("click", function () {
    window.location.href = "https://example.com"; // Replace with the actual URL
  });
}
});

const newFormHandler = async (event) => {
  event.preventDefault();
  const name = document.querySelector("#input_text").value.trim();
  if (name) {
    const response = await fetch(`/api/item`, {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      document.location.replace("/profile");
    } else {
      alert("Failed to add item");
    }
  }
};

const secretSantaBtn = async (event) => {
  event.preventDefault();
  const response = await fetch("/api/users/profile");
  const data = await response.json();

  const nameDisplayed = document.querySelector("#personID");
  if (data.message) {
    nameDisplayed.textContent = "Seems like all our users have been chosen";
  } else {
    nameDisplayed.textContent = data.name;
    const nameOnPage = document.querySelector('.renderedChosenName')
    nameOnPage.textContent = 'Your chosen person: ' + data.name;

  }
  console.log(data);
};

const reloadPage = (event) =>{
    location.reload()
}
document.querySelector('.modal-close')?.addEventListener('click', reloadPage)

document
  .querySelector(".new-item-form")
  .addEventListener("submit", newFormHandler);

document
  .querySelector("#secretSantaBtn")
  ?.addEventListener("click", secretSantaBtn);
