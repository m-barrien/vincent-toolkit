const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

module.exports.replace_all = function replace_all(payload,filestring, opentag="&lt;&lt;" ,closetag="&gt;&gt;") {
	_filestring = filestring + " ";
	Object.keys(payload).forEach(function(key) {
		if (key != "items") {
 			//console.table('Key : ' + key + ', Value : ' + payload[key])
 			_filestring = _filestring.replace( opentag + key + closetag, payload[key])
 			if (key == "email") {
 				//do it twice
 				_filestring = _filestring.replace( opentag + key + closetag, payload[key])
 			}
 			//console.log(opentag + key + closetag)
		}
	})	
	return _filestring;
}
module.exports.replace_items_to_rows = function replace_items_to_rows(payload, filestring, row_place_tag="<!--rows-->", opentag="&lt;&lt;" ,closetag="&gt;&gt;") {
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
	return _filestring.replace(row_place_tag, compiled_rows);
}

module.exports.string_to_file = function string_to_file(path, content_string, encoding="utf-8") {
	fs.writeFileSync(path, content_string, encoding, function (err) {
	    if (err) {
	        return console.log(err);
	    }
	}); 
	return true;
}
module.exports.fodt_to_pdf = function fodt_to_pdf(filename, outdir="./payloads/") {
	child_process.execSync(`soffice --convert-to pdf --outdir ${outdir} ${outdir}${filename} --headless`);
}
