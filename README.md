# slackHSBot
A webserver that supplies data to outgoing webhooks for a hearthstone-themed slack bots.
Currently used for finding cards in hearthstone and linking their image into chat. 

## Install & Run 
- git clone repo
- npm install
- node app.js

## Usage
Right now the only use case is to provide the image in chat, which means there's currently only one command. 
Configure your slack webhook to send a GET request to the server when it identifies the string 'hsbot'
<br /> *Example:* <br />
``` hsbot [Druid of the Claw] ```

##### Options
Only one extra option is available at the moment. This is still a work in progress. 
- **g**: ```hsbot [Varian Wrynn] -g``` Will link a .gif of the *golden* card image into chat. 

## Checking response *outside* of chat
```curl -X POST --data "text=hsbot [Druid of the Claw]" http://localhost:3000/get_card```

## API
This bot makes use of an external api called [hearthstoneapi](http://hearthstoneapi.com/). Replace my key with your key
from Mashape. This is because I trust you and I'm lazy, but pretty soon I'm gonna hide mine from the repo and get a new
one anyway. 
