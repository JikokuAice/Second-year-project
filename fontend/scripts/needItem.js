const oldName = document.querySelector(".oldName");
const oldPrice = document.querySelector(".oldPrice");

const newName = document.querySelector(".newName");
const newPrice = document.querySelector(".newPrice");

const update = document.querySelector("#update");
const remove = document.querySelector("#delete");

//getting old name and oldprice from backend;
async function display() {
  //getting old price nad name from backend to display it in input fields.
  let fetch = await axios.get("/updateItemNeed/values");
  oldName.value = fetch.data.needItemName;
  oldPrice.value = fetch.data.needItemPrice;
}

display();

update.addEventListener("click", async () => {
  //validations
  if (newName.value.length <= 0 || newPrice.value.length <= 0) {
    Swal.fire({
      icon: "error",
      title: "Fill out all required fields😉",
    });
  } else if (isNaN(newPrice.value)) {
    Swal.fire({
      icon: "warning",
      title: "item price should be in numbers 4️⃣5️⃣1️⃣",
    });
  } else if (newPrice.value < 0) {
    Swal.fire({
      icon: "warning",
      title: "item price should be in postive number ➕number",
    });
  } else {
    let oldname = oldName.value;
    let oldprice = oldPrice.value;
    let newname = newName.value;
    let newprice = newPrice.value;
    let fetch = await axios.get("/home/allocation");
    const currentBudget = newprice - oldprice;
    const needBudget = fetch.data.Needs;

    if (currentBudget > needBudget) {
      Swal.fire({
        icon: "error",
        title: "bidget exceeds 🫡",
      });
    } else {
      
      axios
        .put("/updateItemNeed/values", {
          oldName: oldname,
          oldPrice: oldprice,
          newName: newname,
          newPrice: newprice,
        })
        .then(async (e) => {
          //this is after need item is wsucessfully updated so no need to get item from backend i can use above values i send to backend to update needs.

          const key = fetch.data._id;

          if (oldprice > newprice) {
            let plusNeed = oldprice - newprice;
            let calculate = needBudget + plusNeed;
            let expense = fetch.data.expense + plusNeed;
            axios
              .post("/updateItemNeed/calculate", {
                key: key,
                newNeed: calculate,
                newExpenses: expense,
              })
              .then((e) => {
                Swal.fire({
                  icon: "sucess",
                  title: "item updated 🫡",
                  text: "we will redirect you to needs page",
                  confirmButtonText: "ok",
                }).then((result) => {
                  if (result.isConfirmed) {
                    location.href = "http://localhost:5000/needs";
                  }
                });
              });} 
 
 
 else if (oldprice < newprice) {
            let plusNeed = newprice - oldprice;
            let calculate = needBudget - plusNeed;
            let expense = fetch.data.expense + plusNeed;
            axios
              .post("/updateItemNeed/calculate", {
                key: key,
                newNeed: calculate,
                newExpenses: expense,
              })
              .then((e) => {
                Swal.fire({
                  icon: "sucess",
                  title: "item updated 🫡",
                  text: "we will redirect you to needs page",
                  confirmButtonText: "ok",
                }).then((result) => {
                  if (result.isConfirmed) {
                    location.href = "http://localhost:5000/needs";
                  }
                });
              });
          } else {
            Swal.fire({
              icon: "sucess",
              title: "item updated 🫡",
              text: "we will redirect you to needs page",
              confirmButtonText: "ok",
            }).then((result) => {
              if (result.isConfirmed) {
                location.href = "http://localhost:5000/needs";
              }
            });
          }
        });
    }
  }
});

remove.addEventListener("click", async () => {
  let oldname = oldName.value;
  let oldprice = oldPrice.value;

  axios
    .delete("/updateItemNeed/values", {
      data: { oldName: oldname, oldPrice: oldprice },
    })
    .then(async (e) => {
      let fetch = await axios.get("/home/allocation");
      const needBudget = fetch.data.Needs;
      const key = fetch.data._id;
      const needExpense = fetch.data.expense;

      const calculate = Number(needBudget) + Number(oldprice);
      const expense = needExpense - oldprice;
      console.log(calculate);
      console.log(expense);

      axios
        .post("/updateItemNeed/calculate", {
          key: key,
          newNeed: calculate,
          newExpenses: expense,
        })
        .then((e) => {
          Swal.fire({
            icon: "sucess",
            title: "item removed 🫡",
            text: "we will redirect you to needs page",
            confirmButtonText: "ok",
          }).then((result) => {
            if (result.isConfirmed) {
              location.href = "http://localhost:5000/needs";
            }
          });
        });
    });
});
