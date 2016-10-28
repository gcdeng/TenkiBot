const
  bodyParser = require('body-parser'),
  express = require('express'),
  config = require('config'),
  MongoClient = require('mongodb').MongoClient;

var receivedMessage = require('./receivedMessage/receivedMessage');
var receivedPostback = require('./receivedMessage/receivedPostback');
var receivedDeliveryConfirmation = require('./receivedMessage/receivedDeliveryConfirmation');
var receivedMessageRead = require('./receivedMessage/receivedMessageRead');

var mongodburl = 'mongodb://gcdeng:tenkibot20161019@ds063856.mlab.com:63856/tenkibotdb';
const app = express();

app.set('port', (process.env.PORT || 8057));
// app.use(bodyParser.json({ verify: verifyRequestSignature }));
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// Process application/json
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ? process.env.MESSENGER_APP_SECRET : config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ? (process.env.MESSENGER_VALIDATION_TOKEN) : config.get('validationToken');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ? (process.env.MESSENGER_PAGE_ACCESS_TOKEN) : config.get('pageAccessToken');

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const SERVER_URL = (process.env.SERVER_URL) ? (process.env.SERVER_URL) : config.get('serverURL');

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL)) {
  console.error("\nMissing config values");
  process.exit(1);
}

/*
 * Use your own validation token. Check that the token used in the Webhook
 * setup is the same token used here.
 *
 */
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("\nValidating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("\nFailed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

/*
 * All callbacks for Messenger are POST-ed. They will be sent to the same
 * webhook. Be sure to subscribe your app to your page to receive callbacks
 * for your page.
 * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
 *
 */
 app.post('/webhook', function(req, res){
   var data = req.body;
   if (data.object=='page') {
     data.entry.forEach(function(pageEntry) {
       var pageID = pageEntry.id;
       var timeOfEvent = pageEntry.time;
       pageEntry.messaging.forEach(function(messagingEvent) {
        if (messagingEvent.message) {
          MongoClient.connect(mongodburl, (err, db)=>{
            if (err) {
              console.log('receivedMessage db connect err\n');
              return;
            }
            receivedMessage(messagingEvent, db, function() {
              db.close();
            });
          });
        } else if (messagingEvent.postback) {
          MongoClient.connect(mongodburl, (err, db)=>{
            if (err) return console.log('receivedPostback db connect err\n');
            receivedPostback(messagingEvent, db, ()=>{
              db.close();
            });
          });
        } else if (messagingEvent.delivery) {
          receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.read) {
          receivedMessageRead(messagingEvent);
        } else {
          console.log("\nWebhook received unknown messagingEvent: ", messagingEvent);
        }
       });
     });
     res.sendStatus(200);
   }
 });

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid
// certificate authority.
app.listen(app.get('port'), function() {
  console.log('\nNode app is running on port', app.get('port'));
});
