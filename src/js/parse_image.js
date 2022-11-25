import { windows1252 } from "./encoding_table.js"

function parse_original_image(file_contents) 
{
    // hide error message from previous runs, if any
    document.getElementById("error_message").style.display = "none";

    var data = file_contents;

    // verify header is P6
    if (data[0] != 80 || data[1] != 54 || data[2] != 10) {
        document.getElementById("error_message").innerHTML = "Invalid ppm file :(";
        document.getElementById("error_message").style.display = "block";
        return;
    } else {
        console.log("Valid ppm file :)")
    }
    var char_ptr = 3;

    var width = "";
    while (data[char_ptr] != 32) {
        width += data[char_ptr] - 48;
        char_ptr++;
    }
    char_ptr++;
    width = parseInt(width);

    var height = ""
    while (data[char_ptr] != 10) {
        height += data[char_ptr] - 48;
        char_ptr++;
    }
    char_ptr++;
    height = parseInt(height);

    var denominator = "";
    while (data[char_ptr] != 10) {
        denominator += data[char_ptr] - 48;
        char_ptr++;
    }
    char_ptr++;
    denominator = parseInt(denominator);

    var skip_col = false; 
    var skip_row = false;

    if (width % 2 != 0) {
        width -= 1;
        skip_col = true;
    }
    if (height % 2 != 0) {
        height -= 1;
        skip_row = true;
    }

    // now... parse image data
    let row = [];
    let imageData = [];

    while (char_ptr < (skip_row ? data.length - width : data.length)) {
        let rgb = [];

        for (let i = 0; i < 3; i++) {
            rgb.push(data[char_ptr]);
            char_ptr++;
        }
        row.push(rgb);

        if (row.length == width) {
            imageData.push(row);
            row = [];
            if (skip_col) {
                char_ptr++;
            }
        }
    }

    var ppm_image = {
        'width': width,
        'height': height,
        'denominator': denominator,
        'imageData': imageData
    }

    return ppm_image;
}

function parse_compressed_image(file_contents) 
{
    // hide error message from previous runs, if any
    document.getElementById("d_error_message").style.display = "none";

    var data = file_contents;
    var lines = data.split('\n');
    
    var char_ptr = 0;

    // verify header
    if (lines[char_ptr] != "arith©") {
        document.getElementById("d_error_message").innerHTML = "Invalid arith© compressed file. :(";
        document.getElementById("d_error_message").style.display = "block";
        return;
    } else {
        console.log("Valid arith© compressed image :)")
    }
    char_ptr++;

    var dimension = lines[char_ptr].split(" ");
    var width = dimension[0];
    var height = dimension[1];
    char_ptr++;

    var image_data = lines.slice(char_ptr).join("\n");

    var encoding_table_chars = [];
    for (var i = 0; i < windows1252.length; i++) {
        encoding_table_chars.push(String.fromCharCode(windows1252[i]));
    }

    var data_width = width/2;
    char_ptr = 0;

    // now... parse image data
    var row_data = [];
    var imageData = [];

    while (char_ptr < image_data.length) {
        var bytes = [];
        for (var i = 0; i < 4; i++) {
            let value = encoding_table_chars.indexOf(image_data[char_ptr]);
            bytes.push(value);
            char_ptr++;
        }
        row_data.push(bytes);

        if (row_data.length == data_width) {
            imageData.push(row_data);
            row_data = [];
        }
    }

    var compressed_image = {
        'width': width,
        'height': height,
        'denominator': 255,
        'imageData': imageData
    }

    return compressed_image;
}

export { parse_original_image, parse_compressed_image }