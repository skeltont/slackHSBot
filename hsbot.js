module.exports = function (req, res, next) {
  var request = require('request');
  var userName = req.body.user_name; 
  var card = req.body.text.split('hsbot ')[1].replace(/ /g, "%20");
  var img_url = '';

  var options = {
    url: 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/' + card,
    headers: {
      'X-Mashape-Key': 'wnYzcZi04JmshfcT5RAdKmfFO8jmp1FDCNCjsn1P7IFtfiBVOC'
    }
  }

  request.get(
    //'http://hearthapi.com/v1.0/cards/by-name/' + card,
    options,
    function (e, r, b) {
      //var id = Object.keys(b);
      //img_url = b[0].img;
      //console.log(b);
      var json = JSON.parse(b);
      if (userName !== 'slackbot') {
        return res.status(200).json({
          text:'here you go: ' + json[0].img
        });u
      } else {
        return res.status(200).end();
      }
    }
  );

  /*
  var botPayload = {
    text : img_url
  };

  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  } 
  */
}
