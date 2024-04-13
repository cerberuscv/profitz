$(".comments__input-btn").on("click", function (e) {
  e.preventDefault();

  let commentInput = $(this).parent().find(".comments__input");
  let comment = $.trim(commentInput.val());

  if (comment == "") {
    commentInput.focus();
    showNotification("warning", "You didn't write a comment!");
    return;
  }

  $.ajax({
    type: "POST",
    url: "/create_comment",
    data: { id: article_id, comment: comment },
    success: function () {
      $(".comments__elems").prepend(
        `<div class="comments__elem"><div class="comments__elem-wrapper"><div class="comments__elem-username">${$.trim(
          $(".header__username").text()
        )}</div></div><p class="comments__elem-text">${comment}</p></div>`
      );
      commentInput.val("");
      showNotification("success", "Your comment has been added successfully!");
    },
    error: function () {
      showNotification("error", "Try again later!");
    },
  });
});
