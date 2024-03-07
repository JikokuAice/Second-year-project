const aside = document.querySelector('aside');
const select = document.querySelector('select');
const submit = document.querySelector('button');
const Name = document.querySelector('#itemName');
const Price = document.querySelector('#itemPrice');


submit.addEventListener('click',  (e) => {
    //preventing default to use axios and prevent default form
    e.preventDefault();
   

    try {
        // Making a POST request using Axios
     axios.post('http://localhost:5000/wants/items', {
        //sending add item form to backend at /needs/items url
            Name: Name.value,
            Price: Price.value,
            categoryName:select.value //sending text of drop-down list

        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((e)=>{
            console.log(e)
            //firing axios after sucessfull post request
            Swal.fire({
                icon:'success',
                title:'created',
                text:"item created sucessfully",
                confirmButtonText:'ok'
            }).then((e)=>{
                if(e.isConfirmed){
                    location.reload()
                }
            })
            
        })
        
       

        // Logging the response from the server
    } catch (error) {
        // Handling errors if the POST request fails
        
    }

 
});











// async function display(n,url){
// console.log(n,url)
// let wantAmount = document.querySelector(n)

// let fetch = await axios.get(url);
// let Wants = fetch.data.Wants;
// wantAmount.textContent=`RS : ${Wants.toLocaleString()}`
// }
async function display(n,url){
    console.log(n,url)
    let wantAmount = document.querySelector(n)
    
    let fetch = await axios.get(url);
    let Wants = fetch.data.Wants;
    wantAmount.textContent=`RS : ${Wants.toLocaleString()}`
    }


display('.wantAmount','/home/allocation')


// async function displayCategory(){

//     let fetch = await axios.get('/addcategory/getwant')
//     let data = fetch.data;
//     console.log(data)
//     data.forEach(e => {
     
//     let option = document.createElement('option');
//        option.innerText=`${e.categoryName}`;
//        select.append(option);
//         let ul = document.createElement('ul');
//         let a = document.createElement('a');
//         a.href=""
//         a.innerHTML=`<i class="fa-solid fa-pencil" style="color: #000000;"></i>`
//         let span = document.createElement('span');
//         span.innerText=`${e.categoryName}`
//     ul.append(span)
//     ul.append(a)
//     aside.append(ul)

    
//     });
    
//     }
    
//     displayCategory()


// Fetching the value of category from /needs/item using axios.
async function displayCategory() {
    let fetch = await axios.get('/wants/item');
    let data = fetch.data;
    
    // Using a for...of loop because it respects asynchronous activities.
    for (let e of data) {
        // Creating an option element to add a value to our dropdown input.
        let option = document.createElement('option');
        // Adding the category name.
        option.innerText = `${e.categoryName}`;
        // Adding a value same as the category name that will be used for the above event listener of the button to send the value of the dropdown list.
        option.value = `${e.categoryName}`;
        // Appending the option element to the select element.
        select.append(option);

        // Creating each ul element for each category we created and saved in the DB.
        let ul = document.createElement('ul');
        // Creating an a element.
        let a = document.createElement('a');
        a.href = "";
        a.innerHTML = `<i class="fa-solid fa-pencil" style="color: #000000;"></i>`;
        let span = document.createElement('span');
        // Created span element and added the value of each categoryName we created.
        span.innerText = `${e.categoryName}`;

        // Adding span and a element inside ul element.
        ul.append(span);
        ul.append(a);

        // Saving the value of the item array of each category in the innerArray variable.
        let innerArray = e.items;

        // Looping through each array item of each category.
        innerArray.forEach(element => {
            // Creating li tag element for each item we have inside each category.
            let li = document.createElement('li');
            // Creating a tag element.
            let a = document.createElement('a');
            a.innerHTML = '<a href=""><i class="fa-solid fa-pencil" style="color: #000000;font-size:small"></i>';
            let p1 = document.createElement('p');
            let p2 = document.createElement('p');

            // Adding the name value of each item of the category in p1 variable.
            p1.innerText = `${element.itemName}`;
            // Adding the price value of each item of the category in p1 variable.
            p2.innerText = `Rs.${element.itemprice}`;
            p1.classList.add('list_name');
            p2.classList.add('Li_price');
            // Adding the above elements inside li element.
            li.append(p1);
            li.append(p2);
            li.append(a);

            // Appending each li element to each ul element.
            ul.append(li);
        });

        // Appending ul element to aside.
        aside.append(ul);
    }
}

// Invoking the function.
displayCategory();