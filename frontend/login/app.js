const email = document.getElementById("email");
const password = document.getElementById("password");
const login = document.getElementById("login");
const forgotpassword = document.getElementById("forgotpassword");

login.addEventListener("click", onlogin);
forgotpassword.addEventListener("click", showform);

function onlogin(e) {
  e.preventDefault();
  axios
    .post("http://localhost:5000/login", {
      email: email.value,
      password: password.value,
    })
    .then((res) => {
      alert("User logged in successfully");
      localStorage.setItem("token", res.data.token);
      location.replace("http://127.0.0.1:5500/inapp-features/index.html");
    })
    .catch((err) => {
      alert("invalid password/user not found");
    });
}

function showform(e) {
  e.preventDefault();
    const submit=document.createElement('button')
    submit.innerHTML="SUBMIT";
    submit.addEventListener('click',(e)=>{
        axios.post("http://localhost:5000/forgotpassword",{
            registeredEmail:email.value
        });
    })


  const email = document.createElement("input");
  email.setAttribute("id", "email");
  email.setAttribute("type", "text");

  const registeredmail = document.getElementById("registeredmail");
  registeredmail.innerHTML = "enter registered Mail Id  ";
  registeredmail.setAttribute("id", "XXYY");

  registeredmail.appendChild(email);
  registeredmail.appendChild(submit);



}
