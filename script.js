function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if(user === "admin" && pass === "admin123"){
    localStorage.setItem("isLoggedIn", "true"); 
    window.location.href = "dashboard.html";   
  } else {
    document.getElementById("error").innerText = "Invalid login credentials";
  }
}