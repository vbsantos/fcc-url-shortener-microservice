#!/bin/bash

curl -X POST -H "Content-Type: application/json" -d '{"url":"https://vinicius.bohr.io"}' http://localhost:3000/shorturl
