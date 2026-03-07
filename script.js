function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (user === "admin" && pass === "admin123") {
    alert("Login Successful!");
    
  } else {
    document.getElementById("error").innerText = "Invalid login credentials";
  }
}


function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  document.getElementById("copyMsg").innerText = "Copied!";
  setTimeout(() => { document.getElementById("copyMsg").innerText = ""; }, 1500);
}