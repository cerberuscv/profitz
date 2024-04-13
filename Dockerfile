FROM golang:1.22.1-alpine3.19
WORKDIR /app
COPY . .
EXPOSE 80 80
RUN go build -o bin
ENTRYPOINT /app/bin