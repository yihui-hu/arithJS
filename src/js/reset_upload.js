// reset elements on screen when user chooses to upload another image

function resetCommon() {
    document.getElementById("hovered_color_decompressed").style.background = "";
    document.getElementById("hovered_color_decompressed").textContent = "";
    document.getElementById("hovered_color_original").style.background = "";
    document.getElementById("hovered_color_original").textContent = "";
    document.getElementById("hovered_color_original_text").textContent = "";
    document.getElementById("hovered_color_decompressed_text").textContent = "";

    var hovered_zoom_decompressed = document.getElementById('hovered_zoom_decompressed');
    var hovered_zoom_decompressed_ctx = hovered_zoom_decompressed.getContext("2d");
    hovered_zoom_decompressed_ctx.clearRect(0, 0, hovered_zoom_decompressed.width, hovered_zoom_decompressed.height);

    var hovered_zoom_original = document.getElementById('hovered_zoom_original');
    var hovered_zoom_original_ctx = hovered_zoom_original.getContext("2d");
    hovered_zoom_original_ctx.clearRect(0, 0, hovered_zoom_original.width, hovered_zoom_original.height);

    document.getElementById("inspection").style.display = "none";
    document.getElementById("hover_hint").style.display = "none";
}   

function resetOriginalUpload() {
    var link = document.getElementById('download_link');
    var button = document.getElementById('compress_button');
    document.getElementById("original_file").value = null;
    link.removeAttribute("href");
    button.style.cursor = "default";
    button.style.backgroundColor = "#C9D5F8";

    document.getElementById("sample_images").style.display = "block";
    document.getElementById("upload_another").style.display = "none";
    document.getElementById("upload_image_box").style.display = "grid";
    document.getElementById("image_canvas").style.display = "none";
    document.getElementById("compression_data").style.display = "none";
    document.getElementById("decompress_hint").style.display = "none";

    var o_canvas = document.getElementById('original_canvas');
    var o_ctx = o_canvas.getContext("2d");
    o_ctx.clearRect(0, 0, o_canvas.width, o_canvas.height);
    o_canvas.width = 0;
    o_canvas.height = 0;

    resetCommon();
}

function resetCompressedUpload() {
    var link = document.getElementById('download_link2');
    var button = document.getElementById('decompress_button');
    document.getElementById("compressed_file").value = null;
    link.removeAttribute("href");
    button.style.cursor = "default";
    button.style.backgroundColor = "rgba(255, 0, 0, 0.20)";

    document.getElementById("upload_d_another").style.display = "none";
    document.getElementById("upload_d_image_box").style.display = "grid";
    document.getElementById("d_image_canvas").style.display = "none"

    var c_canvas = document.getElementById('decompressed_canvas');
    var c_ctx = c_canvas.getContext("2d");
    c_ctx.clearRect(0, 0, c_canvas.width, c_canvas.height);
    c_canvas.width = 0;
    c_canvas.height = 0;

    resetCommon();
}

export { resetOriginalUpload, resetCompressedUpload }
