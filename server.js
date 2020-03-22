const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
var bodyParser = require('body-parser');
const FODTmodule = require('./fodt-module.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(express.static(path.join(__dirname, 'public')))

app.use('/toolkit/pdf/cotizacion', express.static(__dirname + '/payloads/cotizacion.pdf'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.htm'))
})

app.post('/toolkit/cotizacion', function(req, res) {
  var json_payload = req.body;

  var filestring = fs.readFileSync('./assets/cotizacion.fodt',"utf-8").toString();

  file_prereplace = FODTmodule.replace_all(json_payload,filestring);
  final_file = FODTmodule.replace_items_to_rows(json_payload,file_prereplace);
  FODTmodule.string_to_file("./payloads/cotizacion.fodt",final_file);
  FODTmodule.fodt_to_pdf("cotizacion.fodt");  

  res.redirect('/toolkit/pdf/cotizacion');
})

app.listen(3000, function () {
  console.log('Listening on port 3000!')
})
