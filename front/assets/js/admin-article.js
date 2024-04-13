$("#create-article-form").on("submit", function (e) {
  e.preventDefault();

  let btn = $(this).find("button");
  btn.addClass("disabled");

  $.ajax({
    type: "POST",
    url: "/admin/create_article/",
    data: $(this).serialize(),
    success: function () {
      showNotification("success", "The article has been added!");
      setTimeout(() => window.location.replace("/admin"), 1000);
    },
    error: function (xhr) {
      if (xhr.status == 403) {
        showNotification("error", "You are not logged in!");
        btn.removeClass("disabled");
      } else {
        showNotification("error", "Try again later!");
        btn.removeClass("disabled");
      }
    },
  });
});

if (window.location.pathname == "/admin/edit_article/") {
  let article_id = new URLSearchParams(window.location.search).get("id");

  $.ajax({
    type: "POST",
    url: "/article?id=" + article_id,
    success: function (response) {
      try {
        let article = JSON.parse(response);
        let header = article.header;
        let text = article.text;
        let short_text = article.short_text;
        let files = article.files;

        $("#title").val(header);
        $("#text").val(text);
        $("#short-text").val(short_text);
        $("#image").val(files);
      } catch (error) {
        window.location.replace("/admin");
      }
    },
  });
}

$("#edit-article-form").on("submit", function (e) {
  e.preventDefault();

  let article_id = new URLSearchParams(window.location.search).get("id");
  let btn = $(this).find("button");
  btn.addClass("disabled");

  $.ajax({
    type: "POST",
    url: "/admin/edit_article/",
    data: $(this).serialize() + "&id=" + article_id,
    success: function () {
      showNotification("success", "The article has been edited!");
      setTimeout(() => window.location.replace("/admin"), 1000);
    },
    error: function (xhr) {
      if (xhr.status == 403) {
        showNotification("error", "You are not logged in!");
        btn.removeClass("disabled");
      } else {
        showNotification("error", "Try again later!");
        btn.removeClass("disabled");
      }
    },
  });
});

$(document).on("click", "#trash-article", function (e) {
  e.preventDefault();

  let article_id = $(this).attr("data-id");
  let article = $(this).parent().parent();

  $.ajax({
    type: "POST",
    url: "/remove-article",
    data: { id: article_id },
    success: function () {
      showNotification("success", "The article has been deleted!");
      article.fadeOut(500);
    },
    error: function (xhr) {
      if (xhr.status == 403) {
        showNotification("error", "You are not logged in!");
        btn.removeClass("disabled");
      } else {
        showNotification("error", "Try again later!");
        btn.removeClass("disabled");
      }
    },
  });
});
