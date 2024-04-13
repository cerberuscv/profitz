package main

import (
	"net/http"
	"strings"
)

func short_text(text string) (short_text string) {
	i := 0
	for _, s := range text {
		if i >= 30 {
			break
		}
		short_text += string(s)
		i++
	}
	return
}

func remove_article(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		return
	}
	username := ""
	checkuser(r, &username)
	if username != "admin" {
		return
	}
	id := r.FormValue("id")
	_, err := db.Exec(r.Context(), "DELETE FROM articles WHERE id = $1", id)
	if err != nil {
		Logger.Error(err)
		w.WriteHeader(http.StatusBadGateway)
		return
	}
}

func create_comment(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		return
	}
	username := ""
	checkuser(r, &username)
	if username == "" {
		return
	}
	id := r.FormValue("id")
	comment := r.FormValue("comment")
	if strings.TrimSpace(id) == "" || strings.TrimSpace(comment) == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	_, err := db.Exec(r.Context(), "INSERT INTO comments VALUES ($1, $2, $3)", id, username, comment)
	if err != nil {
		Logger.Error(err)
	}
}

func user_info(w http.ResponseWriter, r *http.Request) {
	username := ""
	checkuser(r, &username)
	if username == "" {
		return
	}
	w.Write([]byte(username))
}

func logout(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "auth")
	if err != nil {
		Logger.Error(err)
		return
	}
	session.Values = nil
	err = session.Save(r, w)
	if err != nil {
		Logger.Error(err)
	}
	http.Redirect(w, r, "/", http.StatusSeeOther)
}
