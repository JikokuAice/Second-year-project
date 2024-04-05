const total_amt = document.querySelector("#amount");
const main = document.querySelector(".main");
async function display() {
  let value = await axios.get("/home/allocation");
  let amount_left = value.data.income - value.data.expense;
  total_amt.textContent = `Rs ${amount_left.toLocaleString()}`;
}

display();

async function show() {
  let fetch = await axios.get("/transaction/history");

  fetch.data.forEach((e) => {
    const transaction = document.createElement("div");
    const inner_row = document.createElement("div");

    const inner_col = document.createElement("div");
    const name = document.createElement("p");
    const date = document.createElement("date");
    const amount = document.createElement("span");
    transaction.classList.add("transaction");
    inner_col.classList.add("inner-col");
    inner_row.classList.add("inner-row");
    name.classList.add("name");
    date.classList.add("date");
    amount.classList.add("amount");

    name.textContent = e.Tname;
    date.textContent = e.TDates;
    if (String(e.Tcategory) == "Need") {
      amount.innerHTML = `Rs: ${e.Tprice}<i class="fa-solid fa-trash-can remove" id="${e._id}" style="color: #fb0808;"></i>`;
      inner_row.innerHTML = `<i class="fa-regular fa-circle-down" style="color: #fb0808"></i>`;
    }

    if (String(e.Tcategory) == "Want") {
      inner_row.innerHTML = `<i class="fa-regular fa-circle-down" style="color: #b90ac7;"></i>`;
      amount.innerHTML = `Rs: ${e.Tprice} <i class="fa-solid fa-trash-can remove" id="${e._id}"  style="color: #b90ac7;"></i>`;
    }

    transaction.append(inner_row, amount);
    inner_row.append(inner_col);
    inner_col.append(name, date);
    main.append(transaction);
  });
}
show();

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    e.preventDefault();
    Swal.fire({
      title: "Do you want remove item from transaction history 🤔",
      showDenyButton: true,
      confirmButtonText: "confirm",
      denyButtonText: `cancel`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let fetch = await axios.post("/transaction/history/remove", {
          id: e.target.id,
        });
        if (fetch.data == "success") {
          location.reload();
        }
      } else if (result.isDenied) {
        return;
      }
    });
  }
});
