const fs = require('fs')
const path = require('path')

function replace_all(payload,filestring, opentag="&lt;&lt;" ,closetag="&gt;&gt;") {
	_filestring = filestring + " ";
	Object.keys(payload).forEach(function(key) {
		if (key != "items") {
 			//console.table('Key : ' + key + ', Value : ' + payload[key])
 			_filestring = _filestring.replace( opentag + key + closetag, payload[key])
 			if (key == "email") {
 				_filestring = _filestring.replace( opentag + key + closetag, payload[key])
 			}
 			//console.log(opentag + key + closetag)
		}
	})	
	return _filestring;
}
function items_to_rows(payload,filestring, opentag="&lt;&lt;" ,closetag="&gt;&gt;") {
	_filestring = filestring + " ";
	
	const rowstring = '<table:table-row><table:table-cell table:style-name="Table5.A2" office:value-type="string"><text:p text:style-name="P41">ITEMCOUNT</text:p></table:table-cell><table:table-cell table:style-name="Table5.A2" office:value-type="string"><text:p text:style-name="P25">&lt;&lt;articulocode&gt;&gt;</text:p></table:table-cell><table:table-cell table:style-name="Table5.A2" office:value-type="string"><text:p text:style-name="P32">&lt;&lt;description&gt;&gt;</text:p></table:table-cell><table:table-cell table:style-name="Table5.A2" office:value-type="string"><text:p text:style-name="P25">&lt;&lt;qty&gt;&gt;</text:p></table:table-cell><table:table-cell table:style-name="Table5.A2" office:value-type="string"><text:p text:style-name="P25">&lt;&lt;um&gt;&gt;</text:p></table:table-cell><table:table-cell table:style-name="Table5.A2" office:value-type="string"><text:p text:style-name="P25">&lt;&lt;discount&gt;&gt;</text:p></table:table-cell><table:table-cell table:style-name="Table5.A2" office:value-type="string"><text:p text:style-name="P25">&lt;&lt;priceunit&gt;&gt;</text:p></table:table-cell><table:table-cell table:style-name="Table5.A2" office:value-type="string"><text:p text:style-name="P25">&lt;&lt;priceunitdiscount&gt;&gt;</text:p></table:table-cell><table:table-cell table:style-name="Table5.A2" office:value-type="string"><text:p text:style-name="P25">&lt;&lt;itemtotal&gt;&gt;</text:p></table:table-cell></table:table-row>';

	var compiled_rows ="";
	payload_items = payload["items"];

	var i = 1;
	payload_items.forEach(function(item_obj){
		var _new_row = rowstring + "";
		_new_row = _new_row.replace( "ITEMCOUNT", i++);
		Object.keys(item_obj).forEach(function(key) {
			_new_row = _new_row.replace( opentag + key + closetag, item_obj[key])
		})	
		compiled_rows = compiled_rows + _new_row;
	});
	return _filestring.replace("<!--rows-->", compiled_rows);
}

function write_to_file(path, string, encoding="utf-8") {
	fs.writeFileSync(path, string, encoding, function (err) {
	    if (err) {
	        return console.log(err);
	    }
	}); 
	return true;
}
var filestring = fs.readFileSync('./assets/cotizacion.fodt',"utf-8").toString();
var payload = fs.readFileSync('./payload.json',"utf-8").toString();
payload = JSON.parse(payload);

file_prereplace = replace_all(payload,filestring);
final_file = items_to_rows(payload,file_prereplace);
write_to_file("./wea.fodt",final_file);
