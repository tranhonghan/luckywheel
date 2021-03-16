## Get install

```bash
  git clone https://github.com/tranhonghan/luckywheel
  cd luckywheel
  npm install
  ```

## Dev mode
Befor run this on your machine you need to change some code, due with this code was apply to  https://chat-react-socket.herokuapp.com/, that was online system/ production mode. There are two file need to be correct as below

1) src/components/Main.js ---> line 10
2) server/index.js ---> line 12

After change need to run speparate command 
1) Start backend with 

```bash
npm run server
```

2) Start react view
```bash
npm run react
```

