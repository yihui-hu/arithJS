import { parse_compressed_image } from './parse_image.js';
import { reverse_quantization_dct } from './quantize_dct.js';
import { ypbpr_to_rgb_conversion } from './rgb_ypbpr.js';
import { unpack_bits } from './pack_bits.js'
import { read_compressed_image, print_decompressed_image } from './image_io.js'

function decompress_image(file_contents) 
{
    var startTime = performance.now();
    var compressed_image = parse_compressed_image(file_contents);

    var width = compressed_image.width;
    var height = compressed_image.height;
    var denominator = compressed_image.denominator;
    
    console.log("Compressed image width: " + width);
    console.log("Compressed image height: " + height);
    console.log("Compressed image denominator: " + denominator);

    var raw_bin_data = read_compressed_image(compressed_image);
    var quantized_dct_data = unpack_bits(compressed_image, raw_bin_data);
    var ypbpr_data = reverse_quantization_dct(compressed_image, quantized_dct_data);
    var rgb_data = ypbpr_to_rgb_conversion(compressed_image, ypbpr_data);
    
    var endTime = performance.now();
    console.log(`Decompression took ${endTime - startTime} milliseconds`);
    return print_decompressed_image(compressed_image, rgb_data); 
}

export { decompress_image }