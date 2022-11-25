function perform_quantization_dct(ppm_image, ypbpr_image_data) 
{
    const width = ppm_image.width;
    const height = ppm_image.height;

    var quantized_dct_data = [];
    
    for (var row = 0; row < height; row += 2) {
        var q_dct_row = [];
        for (var col = 0; col < width; col += 2) {
            let pixel1 = ypbpr_image_data[row][col];
            let pixel2 = ypbpr_image_data[row][col + 1];
            let pixel3 = ypbpr_image_data[row + 1][col];
            let pixel4 = ypbpr_image_data[row + 1][col + 1];

            let pb_avg = (pixel1[1] + pixel2[1] + pixel3[1] + pixel4[1]) / 4;
            let pr_avg = (pixel1[2] + pixel2[2] + pixel3[2] + pixel4[2]) / 4;
            let a = (pixel4[0] + pixel3[0] + pixel2[0] + pixel1[0]) / 4;
            let b = (pixel4[0] + pixel3[0] - pixel2[0] - pixel1[0]) / 4;
            let c = (pixel4[0] - pixel3[0] + pixel2[0] - pixel1[0]) / 4;
            let d = (pixel4[0] - pixel3[0] - pixel2[0] + pixel1[0]) / 4;

            a      = quantize_a_float(a);
            b      = quantize_bcd_float(b);
            c      = quantize_bcd_float(c);
            d      = quantize_bcd_float(d);
            pb_avg = quantize_pb_pr(pb_avg);
            pr_avg = quantize_pb_pr(pr_avg);

            let quantized_dct_pixel = [a, b, c, d, pb_avg, pr_avg];
            q_dct_row.push(quantized_dct_pixel);
        }
        quantized_dct_data.push(q_dct_row);
    }
    
    return quantized_dct_data;
}

function reverse_quantization_dct(compressed_image, quantized_dct_data) 
{
    var width = compressed_image.width/2;
    var height = compressed_image.height/2;

    var ypbpr_data = [], cols = compressed_image.height;

    for ( var i = 0; i < cols; i++ ) {
        ypbpr_data[i] = []; 
    }
    
    for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
            var quantized_dct_pixel = quantized_dct_data[row][col];

            let a      = unquantize_a_float(quantized_dct_pixel[0]);
            let b      = unquantize_bcd_float(quantized_dct_pixel[1]);
            let c      = unquantize_bcd_float(quantized_dct_pixel[2]);
            let d      = unquantize_bcd_float(quantized_dct_pixel[3]);
            let pb_avg = unquantize_pb_pr(quantized_dct_pixel[4]);
            let pr_avg = unquantize_pb_pr(quantized_dct_pixel[5]);

            let y1 = a - b - c + d;
            let y2 = a - b + c - d;
            let y3 = a + b - c - d;
            let y4 = a + b + c + d;

            let pixel1 = [ y1, pb_avg, pr_avg ];
            let pixel2 = [ y2, pb_avg, pr_avg ];
            let pixel3 = [ y3, pb_avg, pr_avg ];
            let pixel4 = [ y4, pb_avg, pr_avg ];

            var n_col = 2 * col;
            var n_row = 2 * row;

            ypbpr_data[n_row][n_col] = pixel1;
            ypbpr_data[n_row][n_col + 1] = pixel2;
            ypbpr_data[n_row + 1][n_col] = pixel3;
            ypbpr_data[n_row + 1][n_col + 1] = pixel4;
        }
    }
    return ypbpr_data;
}

function quantize_a_float(a) 
{
    return Math.round(a * 63);
}

function unquantize_a_float(a)
{
    return a / 63;
}

function quantize_bcd_float(bcd) 
{
    if (bcd > 0.3) {
        bcd = 0.3;
    }
    if (bcd < -0.3) {
        bcd = -0.3;
    }

    return Math.round(bcd * 103.33);
}

function unquantize_bcd_float(bcd) 
{
    return bcd / 103.33;
}

const pb_pr_set = [-0.35, -0.20, -0.15, -0.10, -0.077, -0.055, -0.033, -0.011,
                    0.011, 0.033, 0.055, 0.077, 0.10,   0.15,   0.20,   0.35]

function quantize_pb_pr(pbpr) 
{
    const closest = pb_pr_set.reduce((a, b) => {
        return Math.abs(b - pbpr) < Math.abs(a - pbpr) ? b : a;
    });

    return pb_pr_set.indexOf(closest);
}

function unquantize_pb_pr(pbpr) 
{
    return pb_pr_set[pbpr];
}

export { perform_quantization_dct, reverse_quantization_dct }