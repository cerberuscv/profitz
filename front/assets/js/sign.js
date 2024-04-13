$("#sign-up-form").on("submit", function (e) {
  e.preventDefault();

  let btn = $(this).find("button");
  btn.addClass("disabled");

  $.ajax({
    type: "POST",
    url: "/sign-up/",
    data: $(this).serialize(),
    success: function () {
      showNotification("success", "Registration was successful!");
      setTimeout(() => window.location.replace("/"), 1000);
    },
    error: function (xhr) {
      if (xhr.status == 501) {
        showNotification("error", "This username is already in use!");
        btn.removeClass("disabled");
      } else {
        showNotification("error", "Try again later!");
        btn.removeClass("disabled");
      }
    },
  });
});

$("#login-form").on("submit", function (e) {
  e.preventDefault();

  let btn = $(this).find("button");
  btn.addClass("disabled");

  $.ajax({
    type: "POST",
    url: "/login/",
    data: $(this).serialize(),
    success: function () {
      showNotification("success", "Authorization was successful!");
      setTimeout(() => window.location.replace("/"), 1000);
    },
    error: function (xhr) {
      if (xhr.status == 501) {
        showNotification("error", "Invalid username or password");
        btn.removeClass("disabled");
      } else {
        showNotification("error", "Try again later!");
        btn.removeClass("disabled");
      }
    },
  });
});
