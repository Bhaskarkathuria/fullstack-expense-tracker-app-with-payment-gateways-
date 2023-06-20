const expense = document.getElementById("expense");
const description = document.getElementById("description");
const category = document.getElementById("category");
const submit = document.getElementById("submit");
const list = document.getElementById("list");
const list2 = document.getElementById("list2");
const payment = document.getElementById("payment");
const leaderboard = document.getElementById("premiumfeature");

submit.addEventListener("click", onsubmit);
list.addEventListener("click", deletelist);
payment.addEventListener("click", getpayment);
// leaderboard.addEventListener('click', (e)=>{
//     e.preventDefault();
//     const token=localStorage.getItem('token');
//     axios.get('http://localhost:5000/premiumfeatures',{headers:{"Authorization":token}})
//     .then((response)=>{
//         const leaderboard_data=response.data
//         const leaderboardexpenselist=document.getElementById('leaderboardexpenselist')

//         leaderboard_data.forEach((user)=>{
//             const listitem=document.createElement('li')
//             listitem.appendChild(document.createTextNode(`Name:${user.data.name} totalExpense${user.data.totalexpense}`))

//             leaderboardexpenselist.appendChild(listitem)
//         })
//     })
//     .catch(err=>{
//         console.log(err)
//     })
// });

function onsubmit(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  axios
    .post(
      "http://localhost:5000/expenses",
      {
        amount: expense.value,
        description: description.value,
        category: category.value,
      },
      { headers: { Authorization: token } }
    )
    .then((res) => {
      const expense = document.createElement("li");
      expense.setAttribute("id", res.data.id);
      //console.log(res.body)
      expense.appendChild(
        document.createTextNode(
          `AMOUNT=${res.data.amount} DESCRIPTION(${res.data.description}) CATEGORY(${res.data.category})`
        )
      );

      const deleteButton = document.createElement("button");
      deleteButton.setAttribute("class", "btn btn-danger btn-sm");
      deleteButton.setAttribute("type", "button");
      deleteButton.appendChild(document.createTextNode("DELETE"));

      const editButton = document.createElement("button");
      editButton.setAttribute("class", "btn btn-warning btn-sm");
      editButton.setAttribute("type", "button");
      editButton.appendChild(document.createTextNode("EDIT"));

      expense.appendChild(deleteButton);
      expense.appendChild(editButton);

      list.appendChild(expense);
    })
    .catch((err) => {
      console.log(err);
    });
}

function deletelist(e) {
  e.preventDefault();
  if (e.target.classList.contains("btn-danger")) {
    list.removeChild(e.target.parentElement);
  }
  console.log(e.target.parentElement.id);

  axios
    .delete(`http://localhost:5000/expenses/${e.target.parentElement.id}`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function premiumusermessage() {
  document.getElementById("payment").style.visibility = "hidden";
  document.getElementById("list2").innerHTML = "You are a premium user";
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  console.log(token);
  const decodedtoken = parseJwt(token);
  console.log(decodedtoken);

  const isPremiumUser = decodedtoken.premiumUser;
  if (isPremiumUser === true) {
    premiumusermessage();

    const leaderboard = document.createElement("button");
    leaderboard.setAttribute("id", "premiumfeature");
    leaderboard.setAttribute("type", "button");
    leaderboard.appendChild(document.createTextNode("Show LeaderBoard"));

    const exclusive = document.getElementById("premium");
    exclusive.appendChild(leaderboard);

    leaderboard.addEventListener("click", (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:5000/premiumfeatures", {
          headers: { Authorization: token },
        })
        .then((response) => {
          const leaderboard_data = response.data;
          const leaderboardexpenselist = document.getElementById(
            "leaderboardexpenselist"
          );

          leaderboard_data.forEach((user) => {
            const listitem = document.createElement("li");
            listitem.appendChild(
              document.createTextNode(
                `Name:${user.name} totalExpense${user.totalexpense}`
              )
            );

            leaderboardexpenselist.appendChild(listitem);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  axios
    .get(`http://localhost:5000/expenses`, {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log(res.data);
      res.data.forEach((element) => {
        const expense = document.createElement("li");
        expense.setAttribute("id", element.id);
        expense.appendChild(
          document.createTextNode(
            `${element.amount}Rs description${element.description} category${element.category} `
          )
        );

        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "btn btn-danger btn-sm");
        deleteButton.appendChild(document.createTextNode("DELETE"));

        // const editButton=document.createElement('button');
        // editButton.setAttribute('class','btn btn-warning btn-sm');
        // editButton.appendChild(document.createTextNode('EDIT'));

        expense.appendChild(deleteButton);
        // expense.appendChild(editButton);

        list.appendChild(expense);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

function getpayment(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  console.log(token);
  axios
    .get("http://localhost:5000/purchasePremium", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);
      var options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        // "premiumUser":response.isPremiumuser,
        // "payment_id":response.data.payment_id,
        handler: async function (response) {
          await axios
            .post(
              "http://localhost:5000/trasactionstatus",
              {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              { headers: { Authorization: token } }
            )
            .then((response) => {
              const newToken = response.data.token;
              localStorage.setItem("token", newToken);

              alert("you are a premium user Now");

              const buyPremiumButton = document.getElementById("payment");
              const premiumUserText = document.createTextNode(
                "You are a premium user now"
              );
              buyPremiumButton.parentNode.replaceChild(
                premiumUserText,
                buyPremiumButton
              );

              const leaderboard = document.createElement("button");
              leaderboard.setAttribute("id", "premiumfeature");
              leaderboard.setAttribute("type", "button");
              leaderboard.appendChild(
                document.createTextNode("Show LeaderBoard")
              );

              const exclusive = document.getElementById("premium");
              exclusive.appendChild(leaderboard);
            })
            .catch((error) => {
              console.log(error);
            });
        },
      };

      const rzpl = new Razorpay(options);
      rzpl.open();
      e.preventDefault();

      rzpl.on("payment.faled", (response) => {
        console.log(response);
        alert("Something Went Wrong!");
      });
    });
}
