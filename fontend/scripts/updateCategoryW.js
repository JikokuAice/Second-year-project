const deleteButn = document.querySelector("#delete");
const updateButn = document.querySelector("#update");


async function display() {
    let input = document.querySelector(".input");
  
  
    let fetch = await axios.get("/updateCategoryW/value");
   
  input.value=fetch.data;
  }
  display();

document.addEventListener('click',()=>{

    
});



updateButn.addEventListener("click", async () => {
  const newName = document.querySelector(".newInput");
  let input = document.querySelector(".input");
  if (!(newName.value == "" || newName.value == null)) {
    let fetch = await axios.put("/updateCategoryWant", {
      oldKey: input.value,
      newKey: newName.value,
    });
    if(fetch.data.data=='sucess'){
      location.href="http://localhost:5000/wants"
    }
  }else{
    Swal.fire({
      icon:"error",
      title:"OOps😵",
      text:"Cant leave new name field empty 🙅‍♂️"
    })
  }

  
});

deleteButn.addEventListener("click", async () => {
  let input = document.querySelector(".input");
  let fetch = await axios.delete(`/deleteCategoryWant/${input.value}`);
  if (fetch.data.data == "sucess") {
    Swal.fire({
      icon: "sucess",
      title: "category removed 🫡",
      text: "we will redirect you to wants page",
      confirmButtonText: "ok",
    }).then((result) => {
      if (result.isConfirmed) {
        location.href = "http://localhost:5000/wants";
      }
    });
  }
});