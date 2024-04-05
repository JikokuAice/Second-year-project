const oldName = document.querySelector(".oldName");
const oldPrice = document.querySelector(".oldPrice");
const newPrice = document.querySelector(".newPrice");
const newName = document.querySelector(".newName");
const update = document.querySelector("#update");
const remove = document.querySelector("#delete");

async function display() {
  let fetch = await axios.get("/updateItemWant/values");
  oldName.value = fetch.data.wantItemName;
  oldPrice.value = fetch.data.wantItemPrice;
}
display();

//this will fire when user click update button on updateWantItem page.
update.addEventListener("click", async () => {
  //validation if all required field are completed
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
    //sending input field to backend
    let oldname = oldName.value;
    let oldprice = oldPrice.value;
    let newname = newName.value;
    let newprice = newPrice.value;
  

    let fetch = await axios.get("/home/allocation");
    const currentBudget = newprice - oldprice;
    const wantBudget = fetch.data.Wants;

    if (currentBudget > wantBudget) {
      Swal.fire({
        icon: "info",
        title: "want page budget!!😓",
        text: "you lack budget to perform this action please use wants budget wisly🧠",
        confirmButtonText: "ok",
      });
    } else {
      axios
        .put("/updateItemWant/values", {
          oldName: oldname,
          oldPrice: oldprice,
          newName: newname,
          newPrice: newprice,
        })
        .then(async (e) => {
          const key = fetch.data._id;

          if (oldprice > newprice) {
            let pluswant = oldprice - newprice;
            let calculate = wantBudget + pluswant;
            let expense = fetch.data.expense - pluswant;
            axios
              .post("/updateItemWant/calculate", {
                key: key,
                newWant: calculate,
                newExpenses: expense,
              })
              .then((e) => {
                Swal.fire({
                  icon: "sucess",
                  title: "item updated 🫡",
                  text: "we will redirect you to wants page",
                  confirmButtonText: "ok",
                }).then((result) => {
                  if (result.isConfirmed) {
                    location.href = "https://second-year-project.onrender.com/wants";
                  }
                });
              });
          } else if (oldprice < newprice) {
            let pluswant = newprice - oldprice;
            let calculate = wantBudget - pluswant;
            let expense = fetch.data.expense + pluswant;
            axios
              .post("/updateItemWant/calculate", {
                key: key,
                newWant: calculate,
                newExpenses: expense,
              })
              .then((e) => {
                Swal.fire({
                  icon: "sucess",
                  title: "item updated 🫡",
                  text: "we will redirect you to wants page",
                  confirmButtonText: "ok",
                }).then((result) => {
                  if (result.isConfirmed) {
                    location.href = "https://second-year-project.onrender.com/wants";
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
                location.href = "https://second-year-project.onrender.com/needs";
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
    .delete("/updateItemWant/values", {
      data: { oldName: oldname, oldPrice: oldprice },
    })
    .then(async (e) => {
      let fetch = await axios.get("/home/allocation");
      const wantBudget = fetch.data.Wants;
      const key = fetch.data._id;
      const wantExpense = fetch.data.expense;
      const calculate = Number(wantBudget) + Number(oldprice);
      const expense = wantExpense - oldprice;
      axios
        .post("/updateItemWant/calculate", {
          key: key,
          newWant: calculate,
          newExpenses: expense,
        })
        .then((e) => {
          Swal.fire({
            icon: "sucess",
            title: "item removed 🫡",
            text: "we will redirect you to wants page",
            confirmButtonText: "ok",
          }).then((result) => {
            if (result.isConfirmed) {
              location.href = "https://second-year-project.onrender.com/wants";
            }
          });
        });
    });
});
