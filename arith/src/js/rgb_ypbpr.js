function rgb_to_ypbpr_conversion(ppm_image) 
{
    var width = ppm_image.width;
    var height = ppm_image.height;
    var denominator = ppm_image.denominator;
    var image_data = ppm_image.imageData;

    var ypbpr_image_data = [];

    for (var row = 0; row < height; row++) {
        var ypbpr_row = [];
        for (var col = 0; col < width; col++) {
            var rgb = image_data[row][col];

            let r = rgb[0] / denominator;
            let g = rgb[1] / denominator;
            let b = rgb[2] / denominator;
            
            let y  = 0.299     * r + 0.587    * g + 0.114    * b;
            let pb = -0.168736 * r - 0.331264 * g + 0.5      * b;
            let pr = 0.5       * r - 0.418688 * g - 0.081312 * b;

            if (y > 1)      y = 1;
            if (y < 0)      y = 0;
            if (pb > 0.5)  pb = 0.5;
            if (pb < -0.5) pb = -0.5;
            if (pr > 0.5)  pr = 0.5;
            if (pr < -0.5) pr = -0.5;

            let ypbpr = [y, pb, pr];
            ypbpr_row.push(ypbpr);
        }
        ypbpr_image_data.push(ypbpr_row);
    }

    return ypbpr_image_data
}

function ypbpr_to_rgb_conversion(compressed_image, ypbpr_data) 
{
    var width = compressed_image.width;
    var height = compressed_image.height;
    var denominator = compressed_image.denominator;

    var rgb_image_data = [];
    
    for (var row = 0; row < height; row++) {
        var rgb_row = [];
        for (var col = 0; col < width; col++) {
            var ypbpr = ypbpr_data[row][col];

            let y  = ypbpr[0] * denominator;
            let pb = ypbpr[1] * denominator;
            let pr = ypbpr[2] * denominator;
    
            let r = Math.round(y + 0        * pb + 1.402    * pr);
            let g = Math.round(y - 0.344136 * pb - 0.714136 * pr);
            let b = Math.round(y + 1.772    * pb + 0        * pr);
    
            if (r > denominator) r = denominator;
            if (r < 0)           r = 0;
            if (g > denominator) g = denominator;
            if (g < 0)           g = 0;
            if (b > denominator) b = denominator;
            if (b < 0)           b = 0;

            let rgb = [r, g, b];
            rgb_row.push(rgb);
        }
        rgb_image_data.push(rgb_row);
    }

    return rgb_image_data;
}

export { rgb_to_ypbpr_conversion, ypbpr_to_rgb_conversion }