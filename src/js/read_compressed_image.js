import { decompress_image } from "./decompress_image"

var c_imageData;
var c_width;
var c_height;

var c_canvas;
var o_canvas;
var c_ctx;
var o_ctx;
var hovered_color_original;
var hovered_color_decompressed;

function resizeCompressedCanvas() {
    c_canvas.width = c_width;
    c_canvas.height = c_height;
}

function parseCompressed(raw_data, height, width) 
{
    c_width = width;
    c_height = height;

    var bytes = new Uint8ClampedArray(raw_data.length);
    for (var i = 0; i < raw_data.length; i++) {
        bytes[i] = raw_data[i];
    }
    
    c_imageData = new ImageData(bytes, width, height);
}

function pick(event, destination) {

    document.getElementById("hover_hint").style.display = "none";

    const bounding = c_canvas.getBoundingClientRect();
    var x = event.clientX - bounding.left;
    var y = event.clientY - bounding.top;

    const client_width = document.getElementById("decompressed_canvas").clientWidth;
    const client_height = document.getElementById("decompressed_canvas").clientHeight;
    var sx = c_width / client_width;
    var sy = c_height / client_height;

    x = (x * sx)|0;  // scale and cut any fraction to get integer value
    y = (y * sy)|0;

    const pixel_decompressed = c_ctx.getImageData(x, y, 1, 1);
    const data_decompressed = pixel_decompressed.data;
    const r_d = data_decompressed[0];
    const g_d = data_decompressed[1];
    const b_d = data_decompressed[2];
    const rgba_decompressed = `rgba(${r_d}, ${g_d}, ${b_d}, 1)`;
    const rgba_decompressed_text = `rgb(${r_d}, ${g_d}, ${b_d})`;
    destination.style.background = rgba_decompressed;
    destination.textContent = rgba_decompressed_text;
    if ((r_d*0.299 + g_d*0.587 + b_d*0.114) > 186) {
        hovered_color_decompressed.style.color = "#000000";
    } else {
        hovered_color_decompressed.style.color = "#ffffff";
    }

    const pixel_original = o_ctx.getImageData(x, y, 1, 1);
    const data_original = pixel_original.data;
    const r_o = data_original[0];
    const g_o = data_original[1];
    const b_o = data_original[2];
    const rgba_original = `rgba(${r_o}, ${g_o}, ${b_o}, 1)`;
    const rgba_original_text = `rgb(${r_o}, ${g_o}, ${b_o})`;
    hovered_color_original.style.background = rgba_original;
    hovered_color_original.textContent = rgba_original_text;
    if ((r_o*0.299 + g_o*0.587 + b_o*0.114) > 186) {
        hovered_color_original.style.color = "#000000";
    } else {
        hovered_color_original.style.color = "#ffffff";
    }

    document.getElementById("hovered_color_original_text").textContent = "Original";
    document.getElementById("hovered_color_decompressed_text").textContent = "Decompressed";

    // now ZOOMING

    const hovered_zoom_original_ctx = document.getElementById("hovered_zoom_original").getContext("2d");
    hovered_zoom_original_ctx.imageSmoothingEnabled = false;
    hovered_zoom_original_ctx.mozImageSmoothingEnabled = false;
    hovered_zoom_original_ctx.webkitImageSmoothingEnabled = false;
    hovered_zoom_original_ctx.msImageSmoothingEnabled = false;
    const hovered_zoom_decompressed_ctx = document.getElementById("hovered_zoom_decompressed").getContext("2d");
    hovered_zoom_decompressed_ctx.imageSmoothingEnabled = false;
    hovered_zoom_decompressed_ctx.mozImageSmoothingEnabled = false;
    hovered_zoom_decompressed_ctx.webkitImageSmoothingEnabled = false;
    hovered_zoom_decompressed_ctx.msImageSmoothingEnabled = false;

    hovered_zoom_original_ctx.drawImage(o_canvas,
        Math.min(Math.max(0, x - 20), o_canvas.width - 10),
        Math.min(Math.max(0, y - 20), o_canvas.height - 10),
        40, 40,
        0, 0,
        300, 300);
    
    hovered_zoom_decompressed_ctx.drawImage(c_canvas,
        Math.min(Math.max(0, x - 20), c_canvas.width - 10),
        Math.min(Math.max(0, y - 20), c_canvas.height - 10),
        40, 40,
        0, 0,
        300, 300);
}

function read_compressed_image(file) 
{
    var reader = new FileReader();

    document.getElementById("decompress_hint").style.display = "none";

    reader.onload = function (progressEvent) {
        // read in ppm image
        const text = this.result;

        // decompress image!
        var decompressed_image = decompress_image(text, file);

        c_canvas = document.getElementById('decompressed_canvas');
        c_ctx = c_canvas.getContext("2d");
        o_canvas = document.getElementById('original_canvas');
        o_ctx = o_canvas.getContext("2d");
        hovered_color_original = document.getElementById("hovered_color_original");
        hovered_color_decompressed = document.getElementById("hovered_color_decompressed");

        parseCompressed(decompressed_image.raw_data, decompressed_image.height,
                        decompressed_image.width);
        resizeCompressedCanvas();
        c_ctx.putImageData(c_imageData, 0, 0);


        if (o_canvas.width == c_canvas.width ||
            o_canvas.height == c_canvas.height) {
                document.getElementById("hover_hint").style.display = "block";
                c_canvas.addEventListener("mousemove", (event) => pick(event, 
                    hovered_color_decompressed));
        
        }

        var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], { type: 'text/image/x-portable-pixmap' });

            // revoke previous file if any o prevent memory leaks
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);

            return textFile;
        };

        // display download link of decompressed image file
        var link = document.getElementById('download_link2');
        var button = document.getElementById('decompress_button');
        link.href = makeTextFile(decompressed_image.full_data);
        button.style.cursor = "pointer";
        button.style.backgroundColor = "#FF5C00";

        document.getElementById("upload_d_another").style.display = "flex";
        document.getElementById("upload_d_image_box").style.display = "none";
        document.getElementById("d_image_canvas").style.display = "block"
        document.getElementById("inspection").style.display = "flex";
    };

    reader.addEventListener('progress', (event) => {
        if (event.loaded && event.total) {
          const percent = (event.loaded / event.total) * 100;
          console.log(`Progress: ${Math.round(percent)}`);
        }
    });

    reader.readAsText(file);

};

export { read_compressed_image }