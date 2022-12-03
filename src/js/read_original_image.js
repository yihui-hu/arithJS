import { compress_image } from "./compress_image.js"

var NUM_CHANNELS  = 3;
var NUM_HEADERS   = 4;
var DEFAULT_ALPHA = 255;
var GIGABYTE = 1000000000;
var MEGABYTE = 1000000;
var KILOBYTE = 1000;

var imageData;
var width;
var height;

function resizeCanvas(canvas) {
    canvas.width = width;
    canvas.height = height;
}

function parsePPM(data) 
{
    var headers = [];
    var header_size = 0;

    var buffer = "";
    for (var i = 0; headers.length < NUM_HEADERS; i++, header_size++) {
        var char = String.fromCharCode(data[i]);
        if (/\s/.test(char)) {
            headers.push(buffer);
            buffer = "";
        } else {
            buffer += char;
        }
    }

    width  = headers[1];
    height = headers[2];

    var raster = data.slice(header_size);

    var len_with_alpha = (raster.length/NUM_CHANNELS) + raster.length;
    var bytes = new Uint8ClampedArray(len_with_alpha);  
  
    var index = 0;
    for (var i = 0; i < len_with_alpha; i++) {
        if (i % 4 === NUM_CHANNELS) {
            bytes[i] = DEFAULT_ALPHA;
        } else {
            bytes[i] = raster[index++]
        };
    }

    imageData = new ImageData(bytes, width, height);
}

function read_original_image(file) 
{
    var reader = new FileReader();

    reader.onload = function (progressEvent) {
        const text = this.result;
        var data = new Uint8Array(text);

        do_actual_reading(data);
    };

    reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
          const percent = (event.loaded / event.total) * 100;
          console.log(`Progress: ${Math.round(percent)}`);
        }
    });

    reader.readAsArrayBuffer(file);
};

function do_actual_reading(data) 
{
    var original_size = data.length
    var original_data = returnMagnitudeAndUnit(original_size);
    var original_magnitude = original_data.magnitude;
    var original_unit = original_data.unit;
    document.getElementById("original_size").innerHTML = original_magnitude;
    document.getElementById("original_unit").innerHTML = original_unit;

    var canvas = document.getElementById('original_canvas');
    var ctx = canvas.getContext("2d");

    // compress image
    var compressed_image = compress_image(data);

    parsePPM(data);
    resizeCanvas(canvas);
    ctx.putImageData(imageData, 0, 0);

    var textFile = null,
    makeTextFile = function (text) {
        var data = new Blob([text], { type: 'text/image/x-portable-pixmap' });

        var compressed_size = data.size;
        var compressed_data = returnMagnitudeAndUnit(compressed_size);
        var compressed_magnitude = compressed_data.magnitude;
        var compressed_unit = compressed_data.unit;
        document.getElementById("compressed_size").innerHTML = compressed_magnitude;
        document.getElementById("compressed_unit").innerHTML = compressed_unit;
    
        var percentage = 100 - Math.round(compressed_size/original_size * 100);
        document.getElementById("percentage").innerHTML = percentage + "%";

        // revoke previous file if any to prevent memory leaks
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        return textFile;
    };

    // display download link of compressed image file
    var link = document.getElementById('download_link');
    var button = document.getElementById('compress_button');
    link.href = makeTextFile(compressed_image);
    button.style.cursor = "pointer";
    button.style.backgroundColor = "#0057FF";

    // hide and add elements
    document.getElementById("sample_images").style.display = "none";
    document.getElementById("upload_another").style.display = "flex";
    document.getElementById("upload_image_box").style.display = "none";
    document.getElementById("image_canvas").style.display = "block"
    document.getElementById("compression_data").style.display = "block";
    document.getElementById("decompress_hint").style.display = "block";
}

function returnMagnitudeAndUnit(data) {
    var magnitude = 0
    var unit = "";

    if (data >= GIGABYTE) {
        magnitude = (data/GIGABYTE).toFixed(1);
        unit = "gb";
    } else if (data >= MEGABYTE) {
        magnitude = (data/MEGABYTE).toFixed(1);
        unit = "mb";
    } else {
        magnitude = (data/KILOBYTE).toFixed(1);
        unit = "kb";
    }

    var result = {
        magnitude: magnitude,
        unit: unit
    }

    return result;
}

export { read_original_image, do_actual_reading };