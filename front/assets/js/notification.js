$(document).on("click", ".notification", function (e) {
  e.preventDefault();

  $(this).fadeOut(500);
  setTimeout(() => $(this).remove(), 500);
});

$("body").prepend('<div class="notification-wrapper"></div>');

function showNotification(type, text) {
  let icon;
  let header;

  switch (type) {
    case "error":
      icon = "error.svg";
      header = "Error!";
      break;
    case "warning":
      icon = "warning.svg";
      header = "Warning!";
      break;
    case "success":
      icon = "success.svg";
      header = "Success!";
      break;
  }

  let notification = $(
    '<div class="notification notification-' +
      type +
      '"><img class="notification__img"src="/assets/img/icons/' +
      icon +
      '" alt="' +
      type +
      '"/><div class="notification__wrapper"><div class="notification__header">' +
      header +
      '</div><div class="notification__subheader">' +
      text +
      "</div></div></div>"
  );

  $(".notification-wrapper").append(notification);

  setTimeout(() => {
    notification.fadeOut(500);
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}
