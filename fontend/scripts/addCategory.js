const submit = document.querySelector("button");
const needs = document.querySelector("#needs");
const wants = document.querySelector("#wants");
const text = document.querySelector('input[type="text"]');
submit.addEventListener("click", async (e) => {
  e.preventDefault();

  if (needs.checked) {
    axios
      .post("/addcategory/needs", {
        Nname: text.value,
      })
      .then((e) => {
        Swal.fire({
          icon: "success",
          title: "created",
          text: "category created sucessfully for need page",
          confirmButtonText: "ok",
        }).then((result) => {
          if (result.isConfirmed) {
            location.href = "https://second-year-project.onrender.com/needs";
          }
        });
      })
  }

  if (wants.checked) {
    axios.post("/addcategory/wants", {
      Wname: text.value,
    }).then((e) => {
        Swal.fire({
          icon: "success",
          title: "created",
          text: "category created sucessfully for want page",
          confirmButtonText: "ok",
        }).then((result) => {
          if (result.isConfirmed) {
            location.href = "https://second-year-project.onrender.com/wants";
          }
        });
      })
  }
});
