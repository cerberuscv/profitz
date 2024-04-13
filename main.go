package main

import (
	"bytes"
	"context"
	"html/template"
	"net/http"
	"time"

	"github.com/google/logger"
	"github.com/gorilla/sessions"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	index_tmpl   = template.Must(template.ParseFiles("./front/index.html"))
	login_tmpl   = template.Must(template.ParseFiles("./front/login.html"))
	sign_up_tmpl = template.Must(template.ParseFiles("./front/sign-up.html"))
	admin_tmpl   = template.Must(template.ParseFiles("./front/admin/index.html"))
	create_tmpl  = template.Must(template.ParseFiles("./front/admin/create_article.html"))
	edit_tmpl    = template.Must(template.ParseFiles("./front/admin/edit_article.html"))
	article_tmpl = template.Must(template.ParseFiles("./front/article.html"))
)

var (
	key       = "123456789123456789123456789abcdf"
	store     = sessions.NewCookieStore([]byte(key))
	logbuffer = new(bytes.Buffer)
	Logger    = logger.Init("Logger", false, true, logbuffer)
	db        = &pgxpool.Pool{}
)

func main() {
	config, err := pgxpool.ParseConfig("postgres://postgres:newPassword@db/tz")
	if err != nil {
		Logger.Error(err)
	}
	config.MaxConnIdleTime = 3 * time.Second
	config.MaxConnLifetimeJitter = 10 * time.Second
	config.MaxConns = 100000000
	config.MaxConnLifetime = 10 * time.Minute
	db, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		Logger.Error(err)
	}
	mux := http.NewServeMux()
	mux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("./front/assets"))))
	mux.HandleFunc("/", home_page)
	mux.HandleFunc("/login/", sign_in)
	mux.HandleFunc("/sign-up/", sign_up)
	mux.HandleFunc("/create_comment", create_comment)
	mux.HandleFunc("/admin/create_article/", create_article)
	mux.HandleFunc("/admin/edit_article/", edit)
	mux.HandleFunc("/logger/", logger_page)
	mux.HandleFunc("/admin/", admin_page)
	mux.HandleFunc("/user-info/", user_info)
	mux.HandleFunc("/logout/", logout)
	mux.HandleFunc("/remove-article", remove_article)
	mux.HandleFunc("/article", read_article)
	server := &http.Server{
		IdleTimeout:  10 * time.Minute,
		WriteTimeout: 10 * time.Minute,
		ReadTimeout:  10 * time.Minute,
		Handler:      mux,
		Addr:         ":80",
	}
	server.ListenAndServe()
}
