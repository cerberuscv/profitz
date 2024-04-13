let activePage =
  parseInt(new URLSearchParams(window.location.search).get("page")) || 1;

$.ajax({
  type: "POST",
  url: "/",
  data: { offset: activePage !== 1 ? activePage * 12 : "" },
  success: function (response) {
    let json = JSON.parse(response);
    let articles = json.articles;
    let articlesCount = json.articles_count;

    if (articles == null) {
      return;
    }

    let pages = articlesCount / 12;

    if (activePage > pages && pages != 0) {
      activePage = 1;
    }

    let startPage = activePage - 1 > 1 ? activePage - 1 : 1;
    let endPage = activePage + 1 < pages ? activePage + 1 : pages;

    for (let i = startPage; i <= endPage; i++) {
      const pageLink =
        window.location.pathname == "/admin/" ? "/admin?page=" : "?page=";
      const activeClass = i == activePage ? "pagination__btn-num_active" : "";

      const button = `<a class="btn btn_bg-white pagination__btn pagination__btn-num ${activeClass}" href="${pageLink}${i}">${i}</a>`;

      $(".pagination").append(button);
    }

    articles.forEach((article) => {
      let id = article.id;
      let files = article.files;
      let header = article.header;
      let short_text = article.short_text;
      let comments = article.comments;

      if (window.location.pathname == "/admin/") {
        $(".articles__grid").append(
          '<div class="articles__elem"><img class="articles__elem-img" src="' +
            files +
            '" alt="article-img"/><h3 class="articles__elem-title">' +
            header +
            '</h3><h4 class="articles__elem-subtitle">' +
            short_text +
            '</h4><div class="articles__elem-bottom"><a class="btn btn_bg-white articles__elem-btn" href="article?id=' +
            id +
            '">Read<svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 0.792893C-0.097631 1.18342 -0.097631 1.81658 0.292893 2.20711L3.08579 5L0.292893 7.79289C-0.097631 8.18342 -0.097631 8.81658 0.292893 9.20711C0.683417 9.59763 1.31658 9.59763 1.70711 9.20711L5.20711 5.70711C5.59763 5.31658 5.59763 4.68342 5.20711 4.29289L1.70711 0.792893C1.31658 0.402369 0.683417 0.402369 0.292893 0.792893Z" fill="#12131A"/></svg></a><div class="comment"><img src="/assets/img/icons/comment.svg" alt="comment" /><span>' +
            comments +
            '</span></div></div><div class="articles__elem-management"><a class="btn btn_bg-white articles__elem-btn" href="/admin/edit_article?id=' +
            id +
            '">Edit<svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 0.792893C-0.097631 1.18342 -0.097631 1.81658 0.292893 2.20711L3.08579 5L0.292893 7.79289C-0.097631 8.18342 -0.097631 8.81658 0.292893 9.20711C0.683417 9.59763 1.31658 9.59763 1.70711 9.20711L5.20711 5.70711C5.59763 5.31658 5.59763 4.68342 5.20711 4.29289L1.70711 0.792893C1.31658 0.402369 0.683417 0.402369 0.292893 0.792893Z" fill="#12131A"/></svg></a><a class="btn btn_bg-red articles__elem-btn" id="trash-article" data-id="' +
            id +
            '" href="#">Delete<svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" ><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 0.792893C-0.097631 1.18342 -0.097631 1.81658 0.292893 2.20711L3.08579 5L0.292893 7.79289C-0.097631 8.18342 -0.097631 8.81658 0.292893 9.20711C0.683417 9.59763 1.31658 9.59763 1.70711 9.20711L5.20711 5.70711C5.59763 5.31658 5.59763 4.68342 5.20711 4.29289L1.70711 0.792893C1.31658 0.402369 0.683417 0.402369 0.292893 0.792893Z" fill="#fff"/></svg></a></div></div>'
        );
      } else {
        $(".articles__grid").append(
          ' <div class="articles__elem"><img class="articles__elem-img" src="' +
            files +
            '" alt="article-img"/><h3 class="articles__elem-title">' +
            header +
            '</h3><h4 class="articles__elem-subtitle">' +
            short_text +
            '</h4><div class="articles__elem-bottom"><a class="btn btn_bg-white articles__elem-btn" href="article?id=' +
            id +
            '">Read<svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 0.792893C-0.097631 1.18342 -0.097631 1.81658 0.292893 2.20711L3.08579 5L0.292893 7.79289C-0.097631 8.18342 -0.097631 8.81658 0.292893 9.20711C0.683417 9.59763 1.31658 9.59763 1.70711 9.20711L5.20711 5.70711C5.59763 5.31658 5.59763 4.68342 5.20711 4.29289L1.70711 0.792893C1.31658 0.402369 0.683417 0.402369 0.292893 0.792893Z" fill="#12131A"/></svg></a><div class="comment"><img src="/assets/img/icons/comment.svg" alt="comment" /><span>' +
            comments +
            "</span></div></div></div>"
        );
      }
    });
  },
});
