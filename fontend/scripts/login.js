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
       edata.push('Oops! Email address issue. Please double-check for correctness');  
}

console.log(evalid)
   
if(edata.length > 0){
    evalid.innerText=edata.join(',')
    email.style.border='1px solid red';
}else{
    evalid.innerText="";
    email.style.border='';
}

var number = /[0-9]/g;
var upperCaseLetters = /[A-Z]/g;
//pass.value<8||pass.value==''||pass.value==null||
if(!((pass.value.match(number)&&(pass.value.match(upperCaseLetters))))||pass.value.length<8||pass.value==null||pass.value==""){
pdata.push("Make it 8+, use capital and number")

}

if(pdata.length>0){
   
pvalid.innerText=pdata.join(',');
pass.style.border='1px solid red'
}else{
    pvalid.innerText="";
    pass.style.border=''   
}


if(edata.length==0&&pdata.length==0){
    alert('domne done')
   document.querySelector('form').submit();
}
})


