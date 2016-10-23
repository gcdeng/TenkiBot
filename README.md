# TenkiBot

1.install module

```
$ npm install
```

2.start ngrok

```
$ ./ngrok http 5000
```
port is same to node server

run in background:

```
./ngrok http 5000 -log=stdout > ./tmp/ngroklog.log &
```

use curl localhost:4040/api/tunnels to see public_url

3.start server

```
$ npm start
```

4.deploy to heroku:

write Procfile

```
web: node index.js
```
```
$ git commit
$ heroku create
$ git push heroku master
```

##Todo
1. Subscription
2. Search
3. Favorite
