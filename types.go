package main

type Article struct {
	Header       string    `json:"header"`
	ShortText    string    `json:"short_text"`
	ID           string    `json:"id"`
	Comments     int       `json:"comments"`
	Text         string    `json:"text,omitempty"`
	Files        string    `json:"files"`
	CommentsText []Comment `json:"comments_text,omitempty"`
}

type Comment struct {
	Username string `json:"username"`
	Comment  string `json:"comment"`
}

type HomePage struct {
	Articles       []Article `json:"articles"`
	Articles_count int       `json:"articles_count"`
}
