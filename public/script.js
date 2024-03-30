(function () {
  const fonts = ["cursive", "sans-serif", "serif", "monospace"];
  let captchaValue = "";

  function generateCaptcha() {
    let value = btoa(Math.random() * 1000000000);
    value = value.substr(0, 5 + Math.random() * 2);
    captchaValue = value;
  }

  function setCaptcha() {
    let html = captchaValue
      .split("")
      .map((char) => {
        const rotate = -20 + Math.trunc(Math.random() * 30);
        const font = Math.trunc(Math.random() * fonts.length);
        return `<span 
        style="
          transform:rotate(${rotate}deg);
          font-family:${fonts[font]}
        "
      >${char}</span>`;
      })
      .join("");
    document.querySelector(".login-form .captcha .preview").innerHTML = html;
  }

  function initCaptcha() {
    document
      .querySelector(".login-form .captcha .captcha-refresh")
      .addEventListener("click", function (event) {
        event.preventDefault();
        generateCaptcha();
        setCaptcha();
      });
    generateCaptcha();
    setCaptcha();
  }

  initCaptcha();

  const loginButton1 = document.querySelector("#login-btn1");
  loginButton1.disabled = true;

  document
    .querySelector(".login-form #login-btn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      let inputCaptchaValue = document.querySelector(
        ".login-form .captcha input"
      ).value;
      if (inputCaptchaValue === captchaValue) {
        Swal.fire({
          title: "",
          text: "Captcha Verified!",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "OK",
      })
      } else {
        Swal.fire({
          title: "",
          text: "Invalid Captcha!",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "OK",
      })
      }
    });

  document.querySelector(".login-form .captcha input").addEventListener("input", function () {
    let inputCaptchaValue = this.value;
    if (inputCaptchaValue === captchaValue) {
      Swal.fire({
        title: "",
        text: "Captcha Verified",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "OK",
    })
      loginButton1.disabled = false;
      document.getElementById('captcha').style.display='none';
    } else {
      loginButton1.disabled = true;
    }
  });
})();
