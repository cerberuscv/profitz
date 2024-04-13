CREATE DATABASE tz;

\c tz;

CREATE TABLE users(
    username text UNIQUE,
    password text
);

CREATE TABLE articles(
    id text,
    textor text,
    header text,
    files text,
    short_text text
);

CREATE TABLE comments(
    id text,
    username text,
    text text
);