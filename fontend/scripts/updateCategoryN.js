const deleteButn = document.querySelector("#delete");
const updateButn = document.querySelector("#update");

async function display() {
  let input = document.querySelector(".input");
  let fetch = await axios.get("/updateCategoryN/value");
  input.value = fetch.data;
}
display();

// deleteButn.addEventListener('click',()=>{

// })

/* The `updateButn.addEventListener("click", async () => { ... })` function is an event listener
attached to the `updateButn` element, which listens for a click event on that button. When the
button is clicked, the following actions are performed: */
updateButn.addEventListener("click", async () => {
  const newName = document.querySelector(".newInput");
  let input = document.querySelector(".input");
  if (!(newName.value == "" || newName.value == null)) {
    let fetch = await axios.put("/updateCategoryNeed", {
      oldKey: input.value,
      newKey: newName.value,
    });
    if (fetch.data.data == "sucess") {
      Swal.fire({
        icon: "success",
        title: "category update sucessfully",
        confirmButtonText: "ok",
      }).then((result) => {
        if (result.isConfirmed) {
          location.href = "http://localhost:5000/needs";
        }
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "OOps😵",
      text: "Cant leave new name field empty 🙅‍♂️",
    });
  }
});

/* This event listener is attached to the `deleteButn` element and listens for a click event. When the
button is clicked, it performs the following actions asynchronously: */
deleteButn.addEventListener("click", async () => {
  let input = document.querySelector(".input");
  let fetch = await axios.delete(`/deleteCategoryNeed/${input.value}`);
  if (fetch.data.data == "sucess") {
    Swal.fire({
      icon: "sucess",
      title: "category removed 🫡",
      text: "we will redirect you to needs page",
      confirmButtonText: "ok",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "http://localhost:5000/needs";
      }
    });
  }
});

console.log(deleteButn);
