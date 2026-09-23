/* ============================================
   STACKLY LOGIN + SIGNUP
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================
     ELEMENTS
     ============================================ */

  const authForm = document.getElementById("authForm");

  const authIn = document.getElementById("authIn");
  const authOk = document.getElementById("authOk");
  const authCard = document.getElementById("authCard");
  const closeBtn = document.getElementById("closeBtn");

  const roleButtons = document.querySelectorAll(".role");
  const modeButtons = document.querySelectorAll(".seg button");

  const nameField = document.querySelector(".f-name");
  const nameInput = document.getElementById("aName");
  const emailInput = document.getElementById("aMail");
  const passwordInput = document.getElementById("aPass");
  const confirmPasswordInput = document.getElementById("aPass2");

  const rememberInput = document.getElementById("aRemember");
  const termsInput = document.getElementById("aTerms");

  const eyeBtn = document.getElementById("eye");
  const forgotBtn = document.getElementById("forgot");
  const submitBtn = document.getElementById("goBtn");

  const passwordMeter = document.querySelector(".meter");
  const passwordMeterText = document.getElementById("meterT");

  const welcomeTitle = document.getElementById("wTitle");
  const welcomeLead = document.getElementById("wLead");
  const checkText = document.getElementById("aCheckTx");


  /* ============================================
     STATE
     ============================================ */

  let selectedRole = "Donor";
  let currentMode = "login";


  /* ============================================
     HELPER FUNCTIONS
     ============================================ */

  function getField(input) {
    if (!input) return null;
    return input.closest(".field");
  }


  function showError(input, message) {
    const field = getField(input);

    if (!field) return;

    field.classList.add("err");

    const errorText = field.querySelector(".err-msg");

    if (errorText) {
      errorText.textContent = message;
    }
  }


  function clearError(input) {
    const field = getField(input);

    if (!field) return;

    field.classList.remove("err");

    const errorText = field.querySelector(".err-msg");

    if (errorText) {
      errorText.textContent = "";
    }
  }


  function clearAllErrors() {
    document.querySelectorAll(".field.err").forEach(function (field) {
      field.classList.remove("err");
    });

    document.querySelectorAll(".err-msg").forEach(function (message) {
      message.textContent = "";
    });
  }


  /* ============================================
     EMAIL VALIDATION
     ============================================ */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ============================================
     STRONG PASSWORD VALIDATION
     ============================================ */

  function isStrongPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=])[A-Za-z\d@$!%*?&^#()_+\-=]{8,}$/.test(password);
  }


  /* ============================================
     PASSWORD STRENGTH METER
     ============================================ */

  function updatePasswordStrength(password) {

    if (!passwordMeter || !passwordMeterText) {
      return;
    }

    const bars = passwordMeter.querySelectorAll("i");

    let score = 0;

    if (password.length >= 8) {
      score++;
    }

    if (/[a-z]/.test(password)) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/\d/.test(password)) {
      score++;
    }

    if (/[@$!%*?&^#()_+\-=]/.test(password)) {
      score++;
    }


    /* Reset bars */

    bars.forEach(function (bar) {
      bar.classList.remove("on");
    });


    /* Fill bars */

    bars.forEach(function (bar, index) {

      if (index < score) {
        bar.classList.add("on");
      }

    });


    /* Strength text */

    if (!password) {

      passwordMeterText.textContent =
        "Use 8+ characters with uppercase, lowercase, number and special character.";

    } else if (score <= 2) {

      passwordMeterText.textContent =
        "Weak password";

    } else if (score <= 4) {

      passwordMeterText.textContent =
        "Fair password";

    } else {

      passwordMeterText.textContent =
        "Strong password";

    }

  }


  /* ============================================
     UPDATE SIGNUP VISIBILITY
     ============================================ */

  function updateSignupFields() {

    const signupMode = currentMode === "signup";


    /* Name */

    if (nameField) {
      nameField.hidden = !signupMode;
    }


    /* Confirm password */

    if (confirmPasswordInput) {

      const confirmField =
        getField(confirmPasswordInput);

      if (confirmField) {
        confirmField.hidden = !signupMode;
      }

    }


    /* Terms */

    if (termsInput) {

      const termsField =
        getField(termsInput);

      if (termsField) {
        termsField.hidden = !signupMode;
      }

    }


    /* Password meter */

    if (passwordMeter) {
      passwordMeter.hidden = !signupMode;
    }


    /* Remember */

    if (checkText) {
      checkText.textContent = "Keep me signed in";
    }


    /* Submit button */

    if (submitBtn) {

      submitBtn.textContent =
        signupMode
          ? "Create Account"
          : "Login";

    }

  }


  /* ============================================
     ROLE SELECTION
     ============================================ */

  roleButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      roleButtons.forEach(function (item) {

        item.classList.remove("on");

        item.setAttribute(
          "aria-checked",
          "false"
        );

      });


      button.classList.add("on");

      button.setAttribute(
        "aria-checked",
        "true"
      );


      selectedRole =
        button.dataset.role || "Donor";


      /* Welcome content */

      if (selectedRole === "Volunteer") {

        if (welcomeTitle) {
          welcomeTitle.textContent =
            "Make a Difference.";
        }

        if (welcomeLead) {
          welcomeLead.textContent =
            "Join the volunteer community and help animals through your time, care and support.";
        }

      } else {

        if (welcomeTitle) {
          welcomeTitle.textContent =
            "Give Hope. Change Lives.";
        }

        if (welcomeLead) {
          welcomeLead.textContent =
            "Support animal welfare initiatives and help create safer, happier lives for animals.";
        }

      }

    });

  });


  /* ============================================
     LOGIN / SIGNUP MODE SWITCH
     ============================================ */

  const seg = document.querySelector(".seg");

  modeButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      modeButtons.forEach(function (item) {

        item.classList.remove("on");

        item.setAttribute(
          "aria-selected",
          "false"
        );

      });


      button.classList.add("on");

      button.setAttribute(
        "aria-selected",
        "true"
      );


      currentMode =
        button.dataset.m || "login";


      /* Move black slider */

      if (seg) {

        seg.classList.toggle(
          "signup",
          currentMode === "signup"
        );

      }


      clearAllErrors();


      if (authForm) {
        authForm.reset();
      }


      updatePasswordStrength("");

      updateSignupFields();

    });

  });


  /* ============================================
     PASSWORD SHOW / HIDE
     ============================================ */

  if (eyeBtn && passwordInput) {

    eyeBtn.addEventListener("click", function () {

      const isPassword =
        passwordInput.type === "password";


      passwordInput.type =
        isPassword
          ? "text"
          : "password";


      eyeBtn.setAttribute(
        "aria-label",
        isPassword
          ? "Hide password"
          : "Show password"
      );


      const icon =
        eyeBtn.querySelector("i");


      if (icon) {

        icon.classList.toggle(
          "fa-eye"
        );

        icon.classList.toggle(
          "fa-eye-slash"
        );

      }

    });

  }


  /* ============================================
     PASSWORD STRENGTH LIVE UPDATE
     ============================================ */

  if (passwordInput) {

    passwordInput.addEventListener(
      "input",
      function () {

        updatePasswordStrength(
          passwordInput.value
        );

        clearError(passwordInput);

      }
    );

  }


  /* ============================================
     CLEAR ERRORS WHEN USER TYPES
     ============================================ */

  if (nameInput) {

    nameInput.addEventListener(
      "input",
      function () {
        clearError(nameInput);
      }
    );

  }


  if (emailInput) {

    emailInput.addEventListener(
      "input",
      function () {
        clearError(emailInput);
      }
    );

  }


  if (confirmPasswordInput) {

    confirmPasswordInput.addEventListener(
      "input",
      function () {
        clearError(confirmPasswordInput);
      }
    );

  }


  /* ============================================
     FORGOT PASSWORD
     ============================================ */

  if (forgotBtn) {

    forgotBtn.addEventListener(
      "click",
      function (event) {

        event.preventDefault();


        const email =
          emailInput
            ? emailInput.value.trim()
            : "";


        if (!email) {

          showError(
            emailInput,
            "Enter your email address first."
          );

          if (emailInput) {
            emailInput.focus();
          }

          return;

        }


        if (!isValidEmail(email)) {

          showError(
            emailInput,
            "Enter a valid email address."
          );

          if (emailInput) {
            emailInput.focus();
          }

          return;

        }


        alert(
          "Password reset instructions would be sent to " +
          email +
          "."
        );

      }
    );

  }


  /* ============================================
     FORM SUBMIT
     ============================================ */

  if (authForm) {

    authForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        clearAllErrors();


        const name =
          nameInput
            ? nameInput.value.trim()
            : "";


        const email =
          emailInput
            ? emailInput.value.trim()
            : "";


        const password =
          passwordInput
            ? passwordInput.value
            : "";


        const confirmPassword =
          confirmPasswordInput
            ? confirmPasswordInput.value
            : "";


        const remember =
          rememberInput
            ? rememberInput.checked
            : false;


        const termsAccepted =
          termsInput
            ? termsInput.checked
            : true;


        /* ==========================================
           SIGNUP VALIDATION
           ========================================== */

        if (currentMode === "signup") {

          let valid = true;


          /* Name */

          if (name.length < 3) {

            showError(
              nameInput,
              "Name must be at least 3 characters."
            );

            valid = false;

          }


          /* Email */

          if (!email) {

            showError(
              emailInput,
              "Email address is required."
            );

            valid = false;

          } else if (!isValidEmail(email)) {

            showError(
              emailInput,
              "Enter a valid email address."
            );

            valid = false;

          }


          /* Password */

          if (!password) {

            showError(
              passwordInput,
              "Password is required."
            );

            valid = false;

          } else if (!isStrongPassword(password)) {

            showError(
              passwordInput,
              "Use 8+ characters with uppercase, lowercase, number and special character."
            );

            valid = false;

          }


          /* Confirm password */

          if (!confirmPassword) {

            showError(
              confirmPasswordInput,
              "Please confirm your password."
            );

            valid = false;

          } else if (password !== confirmPassword) {

            showError(
              confirmPasswordInput,
              "Passwords do not match."
            );

            valid = false;

          }


          /* Terms */

          if (termsInput && !termsAccepted) {

            const termsField =
              getField(termsInput);

            if (termsField) {

              termsField.classList.add("err");

            }

            valid = false;

          }


          if (!valid) {
            return;
          }


          /* ========================================
             CREATE ACCOUNT
             ======================================== */

          if (submitBtn) {

            submitBtn.disabled = true;

            submitBtn.textContent =
              "Creating Account...";

          }


          setTimeout(function () {

            const newUser = {

              name: name,

              email: email,

              role: selectedRole,

              createdAt:
                new Date().toISOString()

            };


            /* Save registered user */

            localStorage.setItem(
              "stacklyUser",
              JSON.stringify(newUser)
            );


            sessionStorage.setItem(
              "registeredUser",
              JSON.stringify(newUser)
            );


            /* ========================================
               RETURN TO LOGIN
               ======================================== */

            currentMode = "login";


            /* Switch Login / Signup buttons */

            modeButtons.forEach(
              function (button) {

                const isLogin =
                  button.dataset.m === "login";


                button.classList.toggle(
                  "on",
                  isLogin
                );


                button.setAttribute(
                  "aria-selected",
                  isLogin
                    ? "true"
                    : "false"
                );

              }
            );


            /* Reset form */

            authForm.reset();


            /* Keep registered email */

            if (emailInput) {

              emailInput.value =
                email;

            }


            /* Keep selected role */

            roleButtons.forEach(
              function (button) {

                const active =
                  button.dataset.role ===
                  selectedRole;


                button.classList.toggle(
                  "on",
                  active
                );


                button.setAttribute(
                  "aria-checked",
                  active
                    ? "true"
                    : "false"
                );

              }
            );


            /* Update UI */

            clearAllErrors();

            updatePasswordStrength("");

            updateSignupFields();


            /* Enable login */

            if (submitBtn) {

              submitBtn.disabled = false;

              submitBtn.textContent =
                "Login";

            }


            /* Focus email */

            if (emailInput) {
              emailInput.focus();
            }


            /* Account created */

            alert(
              "Account created successfully! Please login with your new account."
            );


          }, 700);


          return;

        }


        /* ==========================================
           LOGIN VALIDATION
           ========================================== */

        let valid = true;


        /* Email */

        if (!email) {

          showError(
            emailInput,
            "Email address is required."
          );

          valid = false;

        } else if (!isValidEmail(email)) {

          showError(
            emailInput,
            "Enter a valid email address."
          );

          valid = false;

        }


        /* Password */

        if (!password) {

          showError(
            passwordInput,
            "Password is required."
          );

          valid = false;

        } else if (!isStrongPassword(password)) {

          showError(
            passwordInput,
            "Use 8+ characters with uppercase, lowercase, number and special character."
          );

          valid = false;

        }


        if (!valid) {
          return;
        }


        /* ==========================================
           LOGIN
           ========================================== */

        if (submitBtn) {

          submitBtn.disabled = true;

          submitBtn.textContent =
            "Signing In...";

        }


        setTimeout(function () {

          const storedUser =
            localStorage.getItem(
              "stacklyUser"
            );


          let user;


          if (storedUser) {

            try {

              user =
                JSON.parse(
                  storedUser
                );

            } catch (error) {

              user = null;

            }

          }


          /* Registered account */

          if (user) {

            user.email = email;

            user.role = selectedRole;

          } else {

            /* Demo login */

            user = {

              name:
                selectedRole === "Volunteer"
                  ? "Stackly Volunteer"
                  : "Stackly Donor",

              email: email,

              role: selectedRole,

              loginAt:
                new Date().toISOString()

            };

          }


          /* Save current session */

          sessionStorage.setItem(
            "stacklyCurrentUser",
            JSON.stringify(user)
          );


          /* Remember login */

          if (remember) {

            localStorage.setItem(
              "stacklyRemember",
              "true"
            );

          } else {

            localStorage.removeItem(
              "stacklyRemember"
            );

          }


          /* ==========================================
             DIRECT DASHBOARD REDIRECT
             ========================================== */

          const destination =
            selectedRole === "Volunteer"
              ? "volunteer-dashboard.html"
              : "donor-dashboard.html";


          window.location.href =
            destination;


        }, 700);

      }
    );

  }


  /* ============================================
     CLOSE BUTTON
     ============================================ */

  if (closeBtn) {

    closeBtn.addEventListener(
      "click",
      function () {

        if (authCard) {

          authCard.classList.add(
            "closing"
          );


          setTimeout(function () {

            window.history.back();

          }, 250);

        } else {

          window.history.back();

        }

      }
    );

  }


  /* ============================================
     INITIAL STATE
     ============================================ */

  if (authOk) {
    authOk.hidden = true;
  }


  if (authIn) {
    authIn.hidden = false;
  }


  /* Default role */

  roleButtons.forEach(
    function (button) {

      const isDefault =
        (button.dataset.role || "") ===
        "Donor";


      button.classList.toggle(
        "on",
        isDefault
      );


      button.setAttribute(
        "aria-checked",
        isDefault
          ? "true"
          : "false"
      );

    }
  );


  selectedRole = "Donor";


  /* Default mode */

  modeButtons.forEach(
    function (button) {

      const isLogin =
        (button.dataset.m || "") ===
        "login";


      button.classList.toggle(
        "on",
        isLogin
      );


      button.setAttribute(
        "aria-selected",
        isLogin
          ? "true"
          : "false"
      );

    }
  );


  currentMode = "login";


  updateSignupFields();

  updatePasswordStrength("");


  /* ============================================
     AUTO-FILL REGISTERED USER
     ============================================ */

  const registeredUser =
    sessionStorage.getItem(
      "registeredUser"
    );


  if (
    registeredUser &&
    emailInput
  ) {

    try {

      const user =
        JSON.parse(
          registeredUser
        );


      if (user.email) {

        emailInput.value =
          user.email;

      }


      if (user.role) {

        selectedRole =
          user.role;


        roleButtons.forEach(
          function (button) {

            const active =
              button.dataset.role ===
              user.role;


            button.classList.toggle(
              "on",
              active
            );


            button.setAttribute(
              "aria-checked",
              active
                ? "true"
                : "false"
            );

          }
        );

      }

    } catch (error) {

      console.warn(
        "Unable to restore registered user."
      );

    }

  }

});