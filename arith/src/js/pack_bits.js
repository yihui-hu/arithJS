function pack_bits(ppm_image, quantized_dct_data) 
{
    var bin_data = [];

    for (var row = 0; row < ppm_image.height/2; row++) {
        var bin_row = [];
        for (var col = 0; col < ppm_image.width/2; col++) {

            let curr_pixel = quantized_dct_data[row][col];
            let a = curr_pixel[0];
            let b = curr_pixel[1];
            let c = curr_pixel[2];
            let d = curr_pixel[3];
            let pb_avg = curr_pixel[4];
            let pr_avg = curr_pixel[5];
            
            let a_bin = bitpacku(a, 6);
            let b_bin = bitpacks(b, 6);
            let c_bin = bitpacks(c, 6);
            let d_bin = bitpacks(d, 6);
            let pb_avg_bin = bitpacku(pb_avg, 4);
            let pr_avg_bin = bitpacku(pr_avg, 4);

            let word_bin = a_bin + b_bin + c_bin + d_bin + 
                           pb_avg_bin + pr_avg_bin;
            
            bin_row.push(word_bin);
        }
        bin_data.push(bin_row);
    }

    return bin_data;
}

function unpack_bits(compressed_image, bin_data) 
{
    var quantized_dct_data = [];

    for (var row = 0; row < compressed_image.height/2; row++) {
        var q_dct_row = [];
        for (var col = 0; col < compressed_image.width/2; col++) {
            let binary = bin_data[row][col];
            
            let a_bin = binary.slice(0, 6);
            let b_bin = binary.slice(6, 12);
            let c_bin = binary.slice(12, 18);
            let d_bin = binary.slice(18, 24);
            let pb_avg_bin = binary.slice(24, 28);
            let pr_avg_bin = binary.slice(28);

            let a = parseInt(a_bin, 2);
            let b = parseSignedInteger(b_bin);
            let c = parseSignedInteger(c_bin);
            let d = parseSignedInteger(d_bin);
            let pb_avg = parseInt(pb_avg_bin, 2);
            let pr_avg = parseInt(pr_avg_bin, 2);

            let quantized_dct_pixel = [a, b, c, d, pb_avg, pr_avg];
            q_dct_row.push(quantized_dct_pixel);
        }
        quantized_dct_data.push(q_dct_row);
    }

    return quantized_dct_data;
}

function dec2bin(dec) 
{
    return (dec >>> 0).toString(2);
}

function parseSignedInteger(bits) {
    var value = parseInt(bits, 2);
    return value & (1 << 5) ? value - (1 << 6) : value;
}

function bitpacku(val, width) 
{
    let binary = dec2bin(val);

    while (binary.length != width) {
        binary = '0' + binary;
    }

    return binary;
}

function bitpacks(val, width) 
{
    let binary = dec2bin(val);

    if (val >= 0) {
        while (binary.length != width) {
            binary = '0' + binary;
        }
    } else {
        binary = binary.slice(-width);
    }

    return binary;
}

export { pack_bits, unpack_bits, dec2bin }