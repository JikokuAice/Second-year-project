const username = document.querySelector('.username')
const oldPass= document.querySelector('.oldpassword')
const newPass = document.querySelector('.newpassword')
const submit = document.querySelector('button');


var number = /[0-9]/g;
var upperCaseLetters = /[A-Z]/g;


submit.addEventListener('click',(e)=>{
    e.preventDefault()
    let newPassArr = []
let oldNewPassValid = []
let usernameValid=[]

    if(newPass.value==null||newPass.value==''||!newPass.value.match(number)||!newPass.value.match(upperCaseLetters)){
        newPassArr.push(1)
    }

    if(newPassArr.length>0){
      Swal.fire({
        icon:"error",
        title: "Oops!",
        text:"check new password field again!"
      
      });
      
    }else{
        
    }

  if(newPassArr.length==0){
    document.querySelector('form').submit()
  }

})



