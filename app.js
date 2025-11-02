// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import {getDatabase,ref,push,onChildAdded,onChildChanged, remove,update } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
  import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword , signInWithPopup , GoogleAuthProvider , signOut , onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";


  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDj9Je-tV5OtHPz_MGEgdJxy4ydCF-Z4gw",
    authDomain: "real-time-database-5239f.firebaseapp.com",
    projectId: "real-time-database-5239f",
    storageBucket: "real-time-database-5239f.firebasestorage.app",
    messagingSenderId: "586642691701",
    appId: "1:586642691701:web:0b324de64792ede1d30a3c",
    measurementId: "G-C29VZN4SFE"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth= getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

//Signup with email and password:

  document.getElementById("signup-btn")?.addEventListener('click' , ()=>{
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth , email , password)
    .then(()=>{
        alert('✔ Sign Up Successfully')
        window.location.href='userName.html'
    })
    .catch((error)=>{
alert(error.message);
    })
  })

  //Login with email and password:

    document.getElementById("login-btn")?.addEventListener('click' , ()=>{
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth , email , password)
    .then(()=>{
        alert('✔ Log In Successfully')
        window.location.href='userName.html'
    })
    .catch((error)=>{
alert(error.message)
    })
  })
//   Continue with Goggle:

document.getElementById("google-btn")?.addEventListener('click' , ()=>{       
    signInWithPopup(auth, provider)
    .then(()=>{
        alert('Login Successfully ✔')
        window.location.href= 'index.html'
    })
    .catch((error)=>{
alert(error.message)
    })
})

//Logout:

document.getElementById('logout-btn')?.addEventListener('click' , ()=>{
  signOut(auth)
  .then(()=>{
    alert('Log Out Successfully')
    window.location.href='index.html'
  })
  .catch((error)=>{
    alert(error.message)
  })
})
   // UserName

window.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start');
  startBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    
    if (username === "") {
      alert("Please enter your name!");
      return;
    }

    // Save username before redirect
    localStorage.setItem("chatUsername", username);

    // Redirect to chat page
    window.location.href = 'chat.html';
  });
});



// Make sendMessage globally accessible
window.sendMessage = function () {
// let username = document.getElementById("username").value;
  let username = localStorage.getItem("chatUsername");
let message = document.getElementById("message").value;
if (message === "") return;
// Push message to Firebase
push(ref(db, "messages"), {
name: username,
text: message
});
document.getElementById("message").value = ""; // Clear input
};
// Function to listen for new messages
onChildAdded(ref(db, "messages"), function(snapshot) {
  const data = snapshot.val();
  const key = snapshot.key;
  const messageBox = document.getElementById("messages");
  const msgElement = document.createElement("p");
  const currentUser = localStorage.getItem("chatUsername");

  msgElement.id = key;

  // If this message belongs to current user → show edit/delete buttons
  if (data.name === currentUser) {
    msgElement.innerHTML = `
      <b>${data.name}:</b> 
      <span>${data.text}</span>
      <button onclick="editMessage('${key}', '${data.text}')">✏️</button>
      <button onclick="deleteMessage('${key}')">🗑️</button>
    `;
    msgElement.classList.add("my-message"); // optional styling class
  } else {
    // Just show message — no buttons
    msgElement.innerHTML = `
      <b>${data.name}:</b> 
      <span>${data.text}</span>
    `;
    msgElement.classList.add("other-message"); // optional styling class
  }

  messageBox.appendChild(msgElement);
  messageBox.scrollTop = messageBox.scrollHeight;
});


// 🧠 Listen for edited messages — updates in realtime
onChildChanged(ref(db, "messages"), function(snapshot) {
  let data = snapshot.val();
  let key = snapshot.key;
  let msgElement = document.getElementById(key);
  if (msgElement) {
    msgElement.querySelector("span").textContent = data.text; // update text only
  }
});

// ✅ Edit function (fixed)
window.editMessage=function(key, oldText) {
      console.log("Edit clicked for key:", key, "oldText:", oldText);
  let newText = prompt("Edit your message:", oldText);
  if (newText !== null && newText.trim() !== "") {
    const msgRef = ref(db, "messages/" + key);
    update(msgRef, { text: newText })
      .then(() => {
        console.log("Message updated!");
      })
      .catch((error) => {
        console.error("Error updating message:", error);
      });
  }
}

  // 🗑️ Delete Message
  window.deleteMessage = function (key) {
    if (confirm("Delete this message?")) {
      remove(ref(db, "messages/" + key));
      location.reload(); // simple refresh to update view
    }
    };



    