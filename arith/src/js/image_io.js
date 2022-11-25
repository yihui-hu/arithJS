import { windows1252 } from "./encoding_table.js"
import { dec2bin } from "./pack_bits.js"

var encoding_table_chars = [];
for (var i = 0; i < windows1252.length; i++) {
    encoding_table_chars.push(String.fromCharCode(windows1252[i]));
}

function print_compressed_image(ppm_image, bin_data) 
{
    var width = ppm_image.width/2;
    var height = ppm_image.height/2;

    var compressed_data = "arith©\n" + width*2 + " " + height*2 + "\n";

    for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
            let binary = bin_data[row][col];
            
            let byte1 = parseInt(binary.slice(0, 8), 2);
            let byte2 = parseInt(binary.slice(8, 16), 2);
            let byte3 = parseInt(binary.slice(16, 24), 2);
            let byte4 = parseInt(binary.slice(24, 32), 2);

            let char1 = encoding_table_chars[byte1];
            let char2 = encoding_table_chars[byte2];
            let char3 = encoding_table_chars[byte3];
            let char4 = encoding_table_chars[byte4];

            compressed_data += (char1 + char2 + char3 + char4);
        }
    }
    return compressed_data;
}

function read_compressed_image(compressed_image) 
{
    var width = compressed_image.width/2;
    var height = compressed_image.height/2;
    var image_data = compressed_image.imageData;

    var bin_data = [];
    
    for (var row = 0; row < height; row++) {
        var row_data = [];
        for (var col = 0; col < width; col++) {
            var bytes = image_data[row][col];
            var binary_str = "";
            for (var i = 0; i < 4; i++) {
                var binary = dec2bin(bytes[i]);
                while (binary.length != 8) {
                    binary = '0' + binary;
                }
                binary_str += binary;
            }
            row_data.push(binary_str);
        }
        bin_data.push(row_data);
    }

    return bin_data;
}

function print_decompressed_image(compressed_image, rgb_data) 
{
    var width = compressed_image.width;
    var height = compressed_image.height;

    var header = "P3\n" + width + " " + height + "\n" + "255";

    var data = "";
    var raw_data = [];
    for (var row = 0; row < height; row++) {
        var row_rgb = [];
        for (var col = 0; col < width; col++) {
            var rgb = rgb_data[row][col].join(" ");
            row_rgb.push(rgb);

            for (var i = 0; i < 3; i++) {
                raw_data.push(rgb_data[row][col][i]);
            }
            raw_data.push(255);
        }
        data += "\n" + row_rgb.join(" ");
    }
    var full_data = header + data + "\n";

    var data_package = {
        height: height,
        width: width,
        full_data: full_data,
        raw_data: raw_data
    }

    return (data_package);
}

export { print_compressed_image, read_compressed_image, print_decompressed_image }