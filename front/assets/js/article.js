let article_id = new URLSearchParams(window.location.search).get("id");

$.ajax({
  type: "POST",
  url: "/article?id=" + article_id,
  success: function (response) {
    try {
      let article = JSON.parse(response);
      let header = article.header;
      let text = article.text;
      let comments = article.comments;
      let files = article.files;
      let comments_text = article.comments_text;

      $(".article__img").attr("src", files);
      $(".article__title").text(header);
      $(".article__text").text(text);
      $(".comment span").text(comments);

      if (comments_text[0].username != "null") {
        comments_text.forEach(function (item) {
          $(".comments__elems").prepend(
            `<div class="comments__elem"><div class="comments__elem-wrapper"><div class="comments__elem-username">
            ${item.username}</div></div><p class="comments__elem-text">${item.comment}</p></div>`
          );
        });
      }
    } catch (error) {
      window.location.replace("/");
    }
  },
});
