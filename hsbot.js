// return arguments sent with request, if any
function checkArguments(request) {
  var req_split = request.split('-');
  var args = [];
  for (i=1; i < req_split.length; i++) {
    args.push(req_split[i]);
  }
  return args;
}

// ghetto bois, ghetto bois, still.
function array_contains(haystack, needle) {
  for (i=0; i < haystack.length; i++) {
    if (haystack[i] === needle) {
      return true;
    }
  }
  return false;
}

// decide what image to return
function formatImageResponse(object, args) {
  var img_url = '';
  if (array_contains(args, 'g')) {
    if (object.imgGold === undefined) {
      img_url = 'Oi, it looks liket that card doesn\'t have a golden card image available. Try the command again without the -g option';
    } else {
      img_url = object.imgGold;
    }
  } else {
    if (object.img === undefined) {
      img_url = 'Oi, it looks like I couldn\'t find that card. This is not Ty\'s fault.';
    } else {
      img_url = object.img;
    }
  }
  return img_url;
}


module.exports = function (req, res, next) {
  // Handle initial data
  var request = require('request'),
      userName = req.body.user_name,
      command = req.body.text,
      img_url = '',
      args = checkArguments(command);;

  // Start formatting data
  var re = /\[(.*?)\]/,
      card = re.exec(command)[1],
      formatted_card = card.replace(/ /g, "%20"),
      options = {
        url: 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/' + formatted_card,
        headers: {
          'X-Mashape-Key': 'wnYzcZi04JmshfcT5RAdKmfFO8jmp1FDCNCjsn1P7IFtfiBVOC'
        }
      };

  // Request response from external api
  request.get(options, function (e, r, b) {
    var json = JSON.parse(b);
    // console.log(r.statusCode);

    // This is just if it broke completely.
    if (e || r.statusCode !== 200) {
      //  || json[0].img === undefined
      return res.status(200).json({
        text: 'Oh Boy! Looks like I couldn\'t find that card. Try formatting your command like "hsbot [Varian Wrynn] -g"'
      });
    }

    // Check to see if we can find the exact card
    if (json.length > 1) {
      for (i = 0; i < json.length; i++) {
        if (json[i].name !== card) {
          img_url = formatImageResponse(json[0], args);
        } else {
          img_url = formatImageResponse(json[i], args);
          break;
        }
      }
    } else {
      img_url = formatImageResponse(json[0], args);
    }

    // Sanity check. We don't want our slackbot to make this shit infinite.
    if (userName !== 'slackbot') {
      return res.status(200).json({
        text: 'here you go: ' + img_url
      });
    } else {
      return res.status(200).end();
    }
  });
}
