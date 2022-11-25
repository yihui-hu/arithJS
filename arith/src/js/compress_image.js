import { parse_original_image } from './parse_image.js';
import { perform_quantization_dct } from './quantize_dct.js';
import { rgb_to_ypbpr_conversion } from './rgb_ypbpr.js';
import { pack_bits } from './pack_bits.js'
import { print_compressed_image } from './image_io.js'

function compress_image(data) 
{
    var startTime = performance.now();
    var ppm_image = parse_original_image(data);

    var width = ppm_image.width;
    var height = ppm_image.height;
    var denominator = ppm_image.denominator;

    console.log("PPM image width: " + width);
    console.log("PPM image height: " + height);
    console.log("PPM image denominator: " + denominator);

    var ypbpr_data = rgb_to_ypbpr_conversion(ppm_image);
    var quantized_dct_data = perform_quantization_dct(ppm_image, ypbpr_data);
    var bin_data = pack_bits(ppm_image, quantized_dct_data);
    
    var endTime = performance.now();
    console.log(`Compression took ${endTime - startTime} milliseconds`);
    return print_compressed_image(ppm_image, bin_data); 
}

export { compress_image }