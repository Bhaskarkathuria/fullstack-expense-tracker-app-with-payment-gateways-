const expense=document.getElementById('expense');
const description=document.getElementById('description');
const category=document.getElementById('category');
const submit=document.getElementById('submit');
const list=document.getElementById('list');
const payment=document.getElementById('payment');

submit.addEventListener('click',onsubmit);
list.addEventListener('click',deletelist);
payment.addEventListener('click',getpayment);



function onsubmit(e){
    e.preventDefault();
    axios.post("http://localhost:5000/expenses",{
        amount:expense.value,
        description:description.value,
        category:category.value
    })
    .then(res=>{
        const expense=document.createElement('li');
        expense.setAttribute('id',res.data.id)
       expense.appendChild(document.createTextNode(`AMOUNT=${res.data.amount} DESCRIPTION(${res.data.description}) CATEGORY(${res.data.category})`))


        const deleteButton=document.createElement('button')
        deleteButton.setAttribute('class','btn btn-danger btn-sm')
        deleteButton.setAttribute('type',"button")
        deleteButton.appendChild(document.createTextNode('DELETE'))

        const editButton=document.createElement('button');
        editButton.setAttribute('class','btn btn-warning btn-sm')
        editButton.setAttribute('type',"button")
        editButton.appendChild(document.createTextNode('EDIT'));

        expense.appendChild(deleteButton);
        expense.appendChild(editButton);

        list.appendChild(expense);
    })
    .catch(err=>{
        console.log(err)
    })
}

function deletelist(e){
    e.preventDefault();
    if(e.target.classList.contains('btn-danger')){
        list.removeChild(e.target.parentElement)
    }

    axios.delete(`http://localhost:5000/expenses/${e.target.parentElement.id}`)
    .then(res=>{
        console.log(res)
    })
    .catch(err=>{
        console.log(err)
    })
}

window.addEventListener('DOMContentLoaded',()=>{
    const token=localStorage.getItem('token')
    axios.get('http://localhost:5000/expenses',{headers:{"Authorisation":token}})
    .then(res=>{
        res.data.forEach(element => {
        const expense=document.createElement('li');
        expense.setAttribute('id',element.id)
        expense.appendChild(document.createTextNode(`${element.amount}Rs description${element.description} category${element.category} `))

        const deleteButton=document.createElement('button');
        deleteButton.setAttribute('class','btn btn-danger btn-sm');
        deleteButton.appendChild(document.createTextNode('DELETE'))

        const editButton=document.createElement('button');
        editButton.setAttribute('class','btn btn-warning btn-sm');
        editButton.appendChild(document.createTextNode('EDIT'));

        expense.appendChild(deleteButton);
        expense.appendChild(editButton);

        list.appendChild(expense);


        });
    })
    .catch(err=>{
        console.log(err)
    })
})


function getpayment(e){
    e.preventDefault();
    const token=localStorage.getItem('token');
    console.log(token)
    axios.get('http://localhost:5000/purchasePremium',{headers:{"Authorisation":token}})
    .then(response=>{
        console.log(response)
        var options = {
            "key":response.data.key_id,
            "order_id":response.data.order.id,
            // "payment_id":response.data.payment_id,
            "handler":async function(response){
                await axios.post('http://localhost:5000/trasactionstatus',{
                    order_id:options.order_id,
                    payment_id:response.razorpay_payment_id
                },{headers:{"Authorisation":token}})

                alert('you are a premium user Now')
            }
        }

        const rzpl=new Razorpay(options);
        rzpl.open();
        e.preventDefault();

        rzpl.on('payment.faled',(response)=>{
            console.log(response)
            alert('Something Went Wrong!')
        })
    })
}