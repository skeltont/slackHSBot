// return arguments sent with request, if any
function checkArguments(request) {
  var req_split = request.split('-');
  var args = [];
  for (j=1; j < req_split.length; j++) {
    args.push(req_split[j].replace(/ /g, ''));
  }
  return args;
}

// ghetto bois, ghetto bois, still.
function array_contains(haystack, needle) {
  for (k=0; k < haystack.length; k++) {
    if (haystack[k] === needle) {
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
      img_url = 'Oooh, it looks like that card doesn\'t have a golden image available. If you weren\'t specific enough I might have grabbed the wrong card. Try being more explicit or using the command again without the -g option';
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
  if (array_contains(args, 'f')) {
    if (object.flavor === undefined) {
      img_url = img_url.concat('\n there\'s no flavor text available for this card.');
    } else {
      img_url = img_url.concat('\n "' + object.flavor + '"');
    }
  }
  return img_url;
}


module.exports = function (req, res, next) {
  // Handle initial data
  var random = true,
      random_array = [],
      request = require('request'),
      userName = req.body.user_name,
      command = req.body.text,
      img_url = '',
      args = checkArguments(command);

  // Start formatting data.
  // try-catch, because of the regex
  try {
    var re = /\[(.*?)\]/,
        card = re.exec(command)[1],
        formatted_card = card.replace(/ /g, "%20"),
        options = {
          url: 'https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/' + formatted_card,
          headers: {
            'X-Mashape-Key': 'wnYzcZi04JmshfcT5RAdKmfFO8jmp1FDCNCjsn1P7IFtfiBVOC'
          }
        };
  } catch (err) {
    return res.status(200).json({
      text: 'I didn\'t quite get that. Try formatting your command like "hsbot [Varian Wrynn] -g"'
    });
  }


  // Request response from external api
  request.get(options, function (e, r, b) {
    var json = JSON.parse(b);
    // console.log(r.statusCode);

    // This is just if it broke completely.
    if (e || r.statusCode !== 200) {
      return res.status(200).json({
        text: 'Oh Boy! Looks like I couldn\'t find that card.'
      });
    }

    // Check to see if we can find the exact card
    if (json.length > 1) {
      for (i = 0; i < json.length; i++) {
        if (json[i].name !== card || json[i].img === undefined) {
          // This is for fun, if someone enters a query that returns many responses,
          // but none are exactly it return a random result. this is fun.
          random_array.push(formatImageResponse(json[i], args));
        } else {
          random = false;
          img_url = "here you go: " + formatImageResponse(json[i], args);
          break;
        }
      }
    } else {
      random = false;
      img_url = formatImageResponse(json[0], args);
    }

    if (random) {
      img_url = "Random closest result: " + random_array[Math.floor(Math.random() * random_array.length)]
    }

    // Sanity check. We don't want our slackbot to make this shit infinite.
    if (userName !== 'slackbot') {
      return res.status(200).json({
        text: img_url
      });
    } else {
      return res.status(200).end();
    }
  });
}
