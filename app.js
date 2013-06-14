 var express = require('express')
  , routes = require('./routes')
  , Firebase = require('firebase')
  , request = require('request')
  , async = require('async')
  , path = require('path')
  , http = require('http')
  , moment = require('moment')
  , j = request.jar();


  var fbref = new Firebase('https://livemet.firebaseio.com/');
  var updateInterval = 10000;
  var app = express();
  var masterRoutes = {};
//KEEP MASTER, CHECK UPDATES, THEN DELETE. CONFIRM DELETE BUT IF LOCATION CHANGES THEN ADD BACK


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function proxyCall()
{
  var kcRoutes = [10,90,34,39,46,47,58,59,79,62,64,65,66,69,73,77,1,3,4,5,6,7,11,14,19,20,21,26,29,30,35,74,84];
  async.mapSeries(kcRoutes, queryKC, processResults);
}

function processResults(err, results)
{

  if (!err)
  {
    results.forEach(function(item)
    {
      var json = JSON.parse(item.data),
      route = item.route;
      //LOOP ONLY IF THERE IS DATA
      if (!!json.d) {
        json.d.forEach(function(vehicle)
        {
          var temp = {};
          temp.busID = vehicle.propertyTag;
          temp.lat = vehicle.lat;
          temp.lon = vehicle.lon;
          temp.route = route;
          temp.direction = 0;
          temp.destination = vehicle.nextStop;
          //VALIDATE
          masterRoutes[temp.busID] = masterRoutes[temp.busID] || {};
          var currentVehicle = masterRoutes[temp.busID];
          if (currentVehicle.lat == temp.lat && currentVehicle.lon == temp.lon)
          {

          }
          else{
            fbref.child('kc').child(temp.busID).set(temp);
          }


          temp = null;
        });
      }
    })
  }

}

function queryKC(route, cb) {
  var rUrl = 'http://www.kc-metro.com/tmwebwatch/GoogleMap.aspx/getVehicles',
  cookie = request.cookie('route=' + route + '; ASP.NET_SessionId=l5abhi13emap1zd1tc1uj5on; __session:webwatch:enableLogin=true; __session:webwatch:=http:');
  
  j.add(cookie);
  request({url:rUrl, jar: j, body: '{routeID: ' + route + '}', method:'POST', headers:{'Content-Type':'application/json'}}, function(err, resp, body)
  {
    //console.log(body);
    cb(err,{route: route, data: body});
  });

}

setInterval(function()
{
  proxyCall();
}, updateInterval);