import React from 'react';
import '../styles/OriginalBox.css';
import arrow from "../assets/arrow.svg"
import upload_blue from "../assets/upload_blue.svg"
import upload_black from "../assets/upload_black.svg"
import { read_original_image } from '../js/read_original_image';
import {
    handle_toroinoue,
    handle_maplestory,
    handle_colorbars
} from '../js/handle_sample_image';
import { resetOriginalUpload } from "../js/reset_upload"
import useMediaQuery from "../hooks/useMediaQuery";
import { motion } from 'framer-motion'

const OriginalBox = () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const hiddenFileInput = React.useRef(null)

    const handleClick = (event) => {
        hiddenFileInput.current.click();
    }

    const handleChange = (event) => {
        read_original_image(event.target.files[0]);
    }

    return (
        <div>
            <motion.div className={isDesktop ? "upload_image_div" : "upload_image_div_mobile"}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 1,
                delay: 0.2,
                ease: [0, 0.71, 0.2, 1.01]
            }}>
                <div 
                    className={isDesktop ? "upload_image_box" : "upload_image_box_mobile"} 
                    id="upload_image_box" 
                    onClick={handleClick}>
                    <div id="upload_image_text">
                        <h3>Compress ppm (P6) image</h3>
                        <img className={isDesktop ? "upload_blue" : "upload_blue_mobile"} src={upload_blue}/>
                    </div>
                </div>
                <div className={isDesktop ? "image_canvas" : "image_canvas_mobile"} id="image_canvas">
                    <canvas id="original_canvas" className="original_canvas"></canvas>
                </div>
                <div className={isDesktop ? "original-flex" : ""}>
                    <div>
                        <button className={isDesktop ? "compress_button" : "compress_button_mobile"} id="compress_button">
                            <a download="compressed_img.ppm" id="download_link">
                                <h3 className={isDesktop ? "download_link_text" : "download_link_text_mobile"}>Download arith© .ppm</h3>
                            </a>
                        </button>
                        <div className={isDesktop ? "error_message" : "error_message_mobile"} id="error_message">
                            <h3>...</h3>
                        </div>
                        <div className={isDesktop ? "upload_another" : "upload_another_mobile"} id="upload_another">
                            <h3 onClick={resetOriginalUpload} className="upload_image_sidepanel_text">
                                or upload another ppm
                            </h3>
                            <img className={isDesktop ? "upload_black" : "upload_black_mobile"} src={upload_black}/>
                        </div>
                    </div>
                    <div className={isDesktop ? "sample_images" : "sample_images_mobile"} id="sample_images">
                        <h3>No ppm images to compress?</h3>
                        <h3>Try out our sample images:</h3>
                        <br></br>
                        <h3 onClick={handle_toroinoue} className="sample_image">✦ toro-inoue.ppm 📁</h3>
                        <h3 onClick={handle_maplestory} className="sample_image">✦ maplestory.ppm 📁</h3>
                        <h3 onClick={handle_colorbars} className="sample_image">✦ color-bars.ppm 📁</h3>
                        <br></br>
                        <h3>Or convert your images to ppm <a className="convert_link" href="https://convertio.co/png-ppm/" target="_blank">here ↗</a></h3>
                    </div>
                    <div className={isDesktop ? "compression_data" : "compression_data_mobile"} id="compression_data">
                        <div className={isDesktop ? "percentage-flex" : ""}>
                            <h3 className={isDesktop ? "percentage" : "percentage_mobile"} id="percentage">/%</h3>
                            <h3 className={isDesktop ? "percentage_text" : "percentage_text_mobile"}id="percentage_text">reduction in file size!</h3>
                        </div>
                        <div className={isDesktop ? "compression_sizes" : "compression_sizes_mobile"} id="compression_sizes">
                            <span className={isDesktop ? "original_size" : "original_size_mobile"} id="original_size">/</span>
                            <span className={isDesktop ? "original_unit" : "original_unit_mobile"} id="original_unit">mb</span>
                            <img  className={isDesktop ? "arrow" : "arrow_mobile"} id="arrow" src={arrow}/>
                            <span className={isDesktop ? "compressed_size" : "compressed_size_mobile"} id="compressed_size">/</span>
                            <span className={isDesktop ? "compressed_unit" : "compressed_unit_mobile"} id="compressed_unit">mb</span>
                        </div>
                    </div>
                    {/* <h3 className={isDesktop ? "decompress_hint" : "decompress_hint_mobile"} id="decompress_hint">Try downloading the image & <br></br>decompressing it below!</h3> */}
                </div>
            </motion.div>
            {/* always hidden */}
            <input type="file"
                id="original_file"
                className="upload_image_input"
                onChange={handleChange}
                ref={hiddenFileInput}
            />
        </div>
    )
}

export default OriginalBox;