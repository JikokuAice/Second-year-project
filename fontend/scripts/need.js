const aside = document.querySelector("aside");
const select = document.querySelector("select");
const submit = document.querySelector("button");
const Name = document.querySelector("#itemName");
const Price = document.querySelector("#itemPrice");
const needsAmount = document.querySelector(".needsAmount");

displayCategory();

submit.addEventListener("click", async (e) => {
  //preventing default to use axios and prevent default form
  e.preventDefault();

  let needBalance = Number(needsAmount.textContent.split(" ")[2]);
  if (
    select.value == "Select Category 🫵" ||
    Name.value.length == 0 ||
    Price.value.length == 0
  ) {
    Swal.fire({
      icon: "error",
      title:
        "opps!😨 enter all field while creating items for Needs budgeting💸",
    });
  } else if (isNaN(Price.value)) {
    Swal.fire({
      icon: "warning",
      title: "item price should be in numbers 4️⃣5️⃣1️⃣",
    });
  } else if (Price.value < 0) {
    Swal.fire({
      icon: "warning",
      title: "item price should be in postive number ➕number",
    });
  } else if (needBalance < Number(Price.value)) {
    Swal.fire({
      icon: "info",
      title: "need page budget!!😓",
      text: "you lack budget to perform this action please use needs budget wisly🧠",
      confirmButtonText: "ok",
    });
  } else {
    try {
      // Making a POST request using Axios
      axios
        .post(
          "/needs/items",
          {
            //sending add item form to backend at /needs/items url
            Name: Name.value,
            Price: Price.value,
            categoryName: select.value, //sending text of drop-down list
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(async (e) => {
          let fetch = await axios.get("/home/allocation");
          
          let calculate = fetch.data.Needs - e.data.itemprice;
          let expense = fetch.data.expense + e.data.itemprice;
          axios
            .post("/needs/calculation", {
              calculate: calculate,
              key: fetch.data._id,
              expense: expense,
            })
            .then((e) => {
              Swal.fire({
                icon: "success",
                title: "created",
                text: "item created sucessfully",
                confirmButtonText: "ok",
              }).then((e) => {
                if (e.isConfirmed) {
                  location.reload();
                }
              });
            });
        });

      // Logging the response from the server
    } catch (error) {
      // Handling errors if the POST request fails
    }
  }
});

async function display() {
  //displaying need amount in top dashboard.
  let needsAmount = document.querySelector(".needsAmount");
  needsAmount.textContent = "";

  let fetch = await axios.get("/home/allocation");
  let Needs = fetch.data.Needs;
  needsAmount.textContent = `RS  ${Needs.toLocaleString()}`;
}

display();

// Fetching the value of category from /needs/item using axios.
async function displayCategory() {
  let fetch = await axios.get("/needs/item");
  let data = fetch.data;

  // Using a for...of loop because it respects asynchronous activities.
  for (let e of data) {
    // Creating an option element to add a value to our dropdown input.
    let option = document.createElement("option");
    // Adding the category name.
    option.innerText = `${e.categoryName}`;
    // Adding a value same as the category name that will be used for the above event listener of the button to send the value of the dropdown list.
    option.value = `${e.categoryName}`;
    // Appending the option element to the select element.
    select.append(option);

    // Creating each ul element for each category we created and saved in the DB.
    let ul = document.createElement("ul");
    // Creating an a element.
    let a = document.createElement("a");
    a.href = "";
    //to allow string literal in inner html uses ` ="{}" `
    a.innerHTML = `<i class="fa-solid fa-pencil  updateNeedCategory" id="${e.categoryName}" style="color: #000000;"></i>`;
    let span = document.createElement("span");
    // Created span element and added the value of each categoryName we created.
    span.innerText = `${e.categoryName}`;

    // Adding span and a element inside ul element.
    ul.append(span);
    ul.append(a);

    // Saving the value of the item array of each category in the innerArray variable.
    let innerArray = e.items;

    // Looping through each array item of each category.
    innerArray.forEach((element) => {
      // Creating li tag element for each item we have inside each category.
      let li = document.createElement("li");
      // Creating a tag element.
      let a = document.createElement("a");
      a.href = "";
      a.innerHTML = `<i class="fa-solid fa-pencil updateNeedItem" id="${element.itemName},${element.itemprice}" style="color: #000000;font-size:small"></i>`;
      let p1 = document.createElement("p");
      let p2 = document.createElement("p");

      // Adding the name value of each item of the category in p1 variable.
      p1.innerText = `${element.itemName}`;
      // Adding the price value of each item of the category in p1 variable.
      p2.innerText = `Rs.${element.itemprice}`;
      p1.classList.add("list_name");
      p2.classList.add("Li_price");
      // Adding the above elements inside li element.
      li.append(p1);
      li.append(p2);
      li.append(a);

      // Appending each li element to each ul element.
      ul.append(li);
    });

    // Appending ul element to aside.
    aside.append(ul);
  }
}

// Invoking the function.

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("updateNeedCategory")) {
    e.preventDefault();
    axios.post(`/updateCategoryN`, { key: e.target.id }).then((e) => {
      location.href = "https://second-year-project.onrender.com/updateCategoryN";
    });
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("updateNeedItem")) {
    e.preventDefault();
    axios.post(`/updateItemNeed`, { key: e.target.id }).then((e) => {
      location.href = "https://second-year-project.onrender.com/updateItemNeed";
    });
  }
});
