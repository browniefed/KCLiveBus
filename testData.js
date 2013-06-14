var request = require('request')
, j = request.jar();

var rUrl = 'http://www.kc-metro.com/tmwebwatch/GoogleMap.aspx/getVehicles';
var cookie = request.cookie('route=10; ASP.NET_SessionId=l5abhi13emap1zd1tc1uj5on; __session:webwatch:enableLogin=true; __session:webwatch:=http:');

j.add(cookie);
request({url:rUrl, jar: j, body: '{routeID: 10}', method:'POST', headers:{'Content-Type':'application/json'}}, function(err, resp, body) {
           console.log(body);
});

var kcRoutes = [10,90,34,39,46,47,58,59,79,62,64,65,66,69,73,77,1,3,4,5,6,7,11,14,19,20,21,26,29,30,35,74,84];


