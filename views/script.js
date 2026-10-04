// Login / Register switching

const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginAlert = document.getElementById("loginAlert");
const registerAlert = document.getElementById("registerAlert");

function showAlert(element, message, type) {
  element.textContent = message;
  element.className = `alert ${type}`;
}

showRegister.addEventListener("click", () => {
  loginPage.classList.add("hidden");
  registerPage.classList.remove("hidden");
});

showLogin.addEventListener("click", () => {
  registerPage.classList.add("hidden");
  loginPage.classList.remove("hidden");
});

// Login

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const loginResponse = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await loginResponse.json();

  if (loginResponse.ok) {
    showAlert(loginAlert, result.message, "success");
    window.location.href = "/dashboard";
  } else {
    showAlert(loginAlert, result.message, "error");
  }
});

// Register

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const registerResponse = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
    }),
  });

  const result = await registerResponse.json();

  if (registerResponse.ok) {
    showAlert(registerAlert, result.message, "success");
    registerForm.reset();
  } else {
    showAlert(loginAlert, result.message.join(", "), "error");
  }
});

// Google button - demo only

const googleBtn = document.getElementById("googleBtn");

googleBtn.addEventListener("click", () => {
  alert("Google signup is only a demo right now.");
});
