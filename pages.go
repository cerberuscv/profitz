package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
)

func logger_page(w http.ResponseWriter, r *http.Request) {
	w.Write(logbuffer.Bytes())
}

func read_article(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		article_tmpl.Execute(w, nil)
	} else if r.Method == "POST" {
		id := r.URL.Query().Get("id")
		if id == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		article := Article{}
		err := db.QueryRow(r.Context(),
			"SELECT * FROM articles WHERE id = $1", id).Scan(
			&article.ID, &article.Text, &article.Header, &article.Files,
			&article.ShortText)
		if err != nil {
			Logger.Error(err)
			return
		}
		rows, err := db.Query(r.Context(),
			"SELECT username, text FROM comments WHERE id = $1", id)
		if err != nil {
			Logger.Error(err)
			return
		}
		defer rows.Close()
		for rows.Next() {
			comment := Comment{}
			err := rows.Scan(&comment.Username, &comment.Comment)
			if err != nil {
				Logger.Error(err)
				continue
			}
			article.CommentsText = append(article.CommentsText, comment)
		}
		article.Comments = len(article.CommentsText)
		if article.Comments == 0 {
			article.CommentsText = append(article.CommentsText, Comment{"null", "null"})
		}
		marshaled, err := json.Marshal(article)
		if err == nil {
			w.Write(marshaled)
		} else {
			Logger.Error(err)
		}
	}
}

func create_article(w http.ResponseWriter, r *http.Request) {
	username := ""
	checkuser(r, &username)
	if username != "admin" {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}
	if r.Method == "GET" {
		create_tmpl.Execute(w, nil)
	} else if r.Method == "POST" {
		header := r.FormValue("header")
		text := r.FormValue("text")
		files := r.FormValue("files")
		id := uuid.New().String()
		_, err := db.Exec(r.Context(),
			"INSERT INTO articles VALUES ($1, $2, $3, $4, $5)",
			id, text, header, files, short_text(text))
		if err != nil {
			Logger.Error(err)
		}
	}
}

func edit(w http.ResponseWriter, r *http.Request) {
	username := ""
	checkuser(r, &username)
	if username != "admin" {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}
	if r.Method == "GET" {
		edit_tmpl.Execute(w, nil)
	} else if r.Method == "POST" {
		header := r.FormValue("header")
		text := r.FormValue("text")
		files := r.FormValue("files")
		id := r.FormValue("id")
		fmt.Println(header, text, files, id)
		_, err := db.Exec(r.Context(),
			"UPDATE articles SET textor = $1, header = $2, files = $3, short_text = $4 WHERE id = $5",
			text, header, files, short_text(text), id)
		if err != nil {
			Logger.Error(err)
		}
	}
}

func admin_page(w http.ResponseWriter, r *http.Request) {
	username := ""
	checkuser(r, &username)
	if username != "admin" {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}
	admin_tmpl.Execute(w, nil)
}

func home_page(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		index_tmpl.Execute(w, nil)
	} else if r.Method == "POST" {
		homepage := HomePage{}
		offset := r.FormValue("offset")
		if offset == "" {
			offset = "0"
		}
		rows, err := db.Query(r.Context(),
			"SELECT header, short_text, id, files FROM articles OFFSET $1 LIMIT 12",
			offset)
		if err != nil {
			Logger.Error(err)
			return
		}
		defer rows.Close()
		err = db.QueryRow(r.Context(), "SELECT COUNT(header) FROM articles").Scan(&homepage.Articles_count)
		if err != nil {
			Logger.Error(err)
		}
		for rows.Next() {
			somexuyna := Article{}
			err := rows.Scan(&somexuyna.Header, &somexuyna.ShortText,
				&somexuyna.ID, &somexuyna.Files)
			if err != nil {
				Logger.Error(err)
				continue
			}
			err = db.QueryRow(r.Context(),
				"SELECT COUNT(text) FROM comments WHERE id = $1",
				somexuyna.ID).Scan(&somexuyna.Comments)
			if err != nil {
				Logger.Error(err)
			}
			homepage.Articles = append(homepage.Articles, somexuyna)
		}
		marshaled, err := json.Marshal(homepage)
		if err != nil {
			Logger.Error(err)
			return
		}
		w.Write(marshaled)
	}
}
