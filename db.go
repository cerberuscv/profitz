package main

import (
	"crypto/sha512"
	"encoding/hex"
	"net/http"
)

func tohash(text string) string {
	hash := sha512.New()
	hash.Write([]byte(text))
	hashInBytes := hash.Sum(nil)
	return hex.EncodeToString(hashInBytes)
}

func checkuser(r *http.Request, username *string) {
	session, err := store.Get(r, "auth")
	if err != nil {
		return
	}
	if session.Values["password"] != nil {
		err = db.QueryRow(r.Context(), "SELECT username FROM users WHERE username = $1 AND password = $2", session.Values["login"], session.Values["password"].(string)).Scan(username)
		if err != nil {
			return
		}
	}
}
