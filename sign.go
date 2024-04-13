package main

import (
	"net/http"
	"strings"
)

func sign_up(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		sign_up_tmpl.Execute(w, nil)
	} else if r.Method == "POST" {
		login := r.FormValue("login")
		password := r.FormValue("pass")
		if strings.TrimSpace(login) == "" || strings.TrimSpace(password) == "" {
			return
		} else {
			_, err := db.Exec(r.Context(),
				"INSERT INTO users VALUES ($1, $2)", login, tohash(password))
			if err != nil {
				w.WriteHeader(501)
				return
			}
			w.WriteHeader(200)
		}
	}
}

func sign_in(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		login_tmpl.Execute(w, nil)
	} else if r.Method == "POST" {
		err := r.ParseForm()
		if err != nil {
			Logger.Error(err)
			return
		}
		session, err := store.Get(r, "auth")
		if err != nil {
			Logger.Error(err)
			return
		}
		pass := r.FormValue("pass")
		login := r.FormValue("login")
		username := ""
		err = db.QueryRow(r.Context(), "SELECT username FROM users WHERE username = $1 AND password = $2", login, tohash(pass)).Scan(&username)
		if err != nil {
			Logger.Error(err)
			w.WriteHeader(501)
			return
		}
		session.Values["login"] = login
		session.Values["password"] = tohash(pass)
		if err = session.Save(r, w); err == nil {
			if login == "admin" {
				w.WriteHeader(201)
			}
			return
		} else {
			Logger.Error(err)
		}
	}
}
