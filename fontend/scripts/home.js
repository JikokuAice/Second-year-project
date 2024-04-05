const logout = document.querySelector(".logout");
const exitButton = document.querySelector(".exit");

const inputValue = document.querySelector(".incomeIn");
const submit = document.querySelector("#allocate");
const names = document.querySelector(".username");

function display() {
  axios.get("/username").then((e) => {
    names.innerText = `  ✨Mr. ${e.data}✨`;
  });
}
display();

submit.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    isNaN(inputValue.value) ||
    Number(inputValue.value) <= 0 ||
    Number(inputValue.value) == null
  ) {
    Swal.fire({
      icon: "error",
      title: "null value , 0 or string not allowed 🥶",
    });
  } else {
    document.querySelector("form").submit();
  }
});

exitButton.addEventListener("click", (e) => {
  e.preventDefault();

  const navbar = document.querySelector(".navbar");
  const texts = document.querySelectorAll(".nav-text");

  // main.classList.toggle('main-hover')
  navbar.classList.toggle("navbar-hover");

  texts.forEach((e) => {
    e.classList.toggle("nav-text-hover");
  });
});

logout.addEventListener("click", (e) => {
  e.preventDefault();
  Swal.fire({
    title: "Do you want to Logout?",
    showDenyButton: true,
    confirmButtonText: "Confirm",
    denyButtonText: `Cancel`,
  }).then((result) => {
    if (result.isConfirmed) {
      axios.post("/logout").then((e) => {
        location.reload();
      });
    } else if (result.isDenied) {
      Swal.fire({
        icon: "error",
        title: "Cancelled",
        text: "you cancelled logout request :)",
      });
    }
  });
});

axios.get("/home/allocation").then((e) => {
  let income = e.data.income;
  let saving = e.data.Saving;
  let expense = e.data.expense;

  let balance = document.querySelector(".balance");

  let outExpense = document.querySelector(".outflow");
  balance.innerText = ` ${income.toFixed(0)}`;
  outExpense.innerText = ` ${expense.toFixed(0)}`;

  let total = document.querySelector(".totalAmount");
  total.innerText = ` ${(income - expense).toFixed(0)}`;

  let Saving = document.querySelector(".saving");
  Saving.innerText = ` ${saving.toLocaleString()}`;
});
