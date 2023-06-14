const email=document.getElementById('email');
const password=document.getElementById('password');
const login=document.getElementById('login');


login.addEventListener('click',onlogin);


function onlogin(e){
    e.preventDefault();
    axios.post('http://localhost:5000/login',{
        email:email.value,
        password:password.value
    })
    .then((res)=>{
        alert("User logged in successfully")
        localStorage.setItem('token',res.data.token)
        location.replace('http://127.0.0.1:5500/inapp-features/index.html')
    }
    )
    .catch(err=>{
     alert("invalid password/user not found")
    })
}