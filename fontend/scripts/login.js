const email = document.querySelector('#inpute')
const  pass = document.querySelector('#inputp')
const evalid = document.querySelector('.emailvalid')
const pvalid = document.querySelector('.passvalid')
const submit = document.querySelector('.submit');



const validemail=(email)=>{
    var symbol=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return symbol.test(email);
}


submit.addEventListener('click',(e)=>{
e.preventDefault();
let edata = [];
let pdata = [];

if(!validemail(email.value)||email.value==null||email.value==""){
       edata.push('erro in email?');  
}


   
if(edata.length>0){
    Swal.fire({
        icon:"error",
        title:"oops!",
        text:"Insert Valid Email Address 😉",
    })
    
}


var number = /[0-9]/g;
var upperCaseLetters = /[A-Z]/g;
//pass.value<8||pass.value==''||pass.value==null||
if(pass.value==null||pass.value==""){
pdata.push("error is happen")

}

if(pdata.length>0){

Swal.fire({
    icon:"error",
    title:"oops!",
    text:"Insert Valid Password 🕵️",
})
}

if(edata.length==0&&pdata.length==0){

   document.querySelector('form').submit();
}
})


