const user = document.querySelector('#signupuser')
const emails = document.querySelector('#signupemail')
const passInput = document.querySelector('#signuppass1')
const confirmPassInput =document.querySelector('#signuppass2')
const submit = document.querySelector('.submit');

//validation showing field
const uvalid = document.querySelector('.uservalid')
 const evalid = document.querySelector('.emailvalid')
  const pValid = document.querySelector('.passvalid')
 const confirmpValid = document.querySelector('.confirmpassvalid')


const emailvalidation = (email)=>{
    var symbol=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return symbol.test(email)
}

submit.addEventListener('click',(e)=>{
e.preventDefault();
const uservalid = [];
const emailvalid = [];  
const passvalid = [];
const passCvalid=[];
  

if(user.value==""||user.value==null){
uservalid.push( ' cant leave username field empty')
}

if(!emailvalidation(emails.value)){
emailvalid.push(' missing "@"');
}




if(uservalid.length > 0){
  
    user.style.border='1px solid red';
    uvalid.innerText=uservalid.join('')  
}
else{
    uvalid.innerText="" ; 
    user.style.border='';
}


if(emailvalid.length > 0){
evalid.innerText=emailvalid.join(',');
emails.style.border='1px solid red';
}
else{
    evalid.innerText='';
    emails.style.border='';
}

var number = /[0-9]/g;
var upperCaseLetters = /[A-Z]/g;

if(!(passInput.value.match(number)&&passInput.value.match(upperCaseLetters))||passInput.value.length < 8||passInput.value==''||passInput.value==null){
passvalid.push('  Make it 8+, use capital and number');
}

if(passvalid.length>0){
    pValid.innerText=passvalid.join(',');
}
else{
    pValid.innerText='';
}

if(confirmPassInput.value !== passInput.value){
   passCvalid.push('  must match password above')
}

if(passCvalid.length>0){
confirmpValid.innerText=passCvalid.join(',')
confirmPassInput.style.border='1px solid red';
passInput.style.border='1px solid red';
}else{
    confirmpValid.innerText=""
}

if(uservalid.length==0 && emailvalid.length==0 && passvalid.length==0 && passCvalid.length==0){
    e.target.submit();
   
}


})