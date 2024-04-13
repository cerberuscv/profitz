function getUserInfo(callback) {
  $.ajax({
    type: "POST",
    url: "/user-info/",
    success: function (response) {
      callback(response);
    },
  });
}

getUserInfo(function (username) {
  let profileElement = $(".header__profile");
  let commentsFormElement = $(".comments__form");

  if (username != "" && profileElement.length > 0) {
    profileElement.css({ display: "flex" });
    $(".header__btns").css({ display: "none" });
    $(".header__username").text(username);
  }

  if (username != "" && commentsFormElement.length > 0) {
    commentsFormElement.css({ display: "block" });
    $(".comments__auth").css({ display: "none" });
  }

  if (
    username != "" &&
    (window.location.pathname == "/login/" ||
      window.location.pathname == "/sign-up/")
  ) {
    window.location.replace("/");
  }
});

$(document).ready(function () {
  $(".preloader").fadeOut(500);
  $("body").css({ overflow: "auto" });
});
