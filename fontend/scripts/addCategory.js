const submit = document.querySelector('button');
const needs = document.querySelector('#needs')
const wants = document.querySelector('#wants')
const text = document.querySelector('input[type="text"]')
console.log(text)
submit.addEventListener('click',async (e)=>{
    e.preventDefault();

    if(needs.checked){
     axios.post('/addcategory/needs',{
        Nname:text.value
     }).catch((err)=>{
        Swal.fire({
            icon:'error',
            title:'Oops',
            text:"failed to create category !try again"
        })
    })
        Swal.fire({
            icon:'success',
            title:'created',
            text:"category created sucessfully"
        })
     
   
    }
    if(wants.checked){
        axios.post('/addcategory/wants',{
            Wname:text.value
         })  
    }

})


