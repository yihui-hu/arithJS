import React from 'react';
import '../styles/CompressedBox.css';
import upload_orange from "../assets/upload_orange.svg"
import upload_black from "../assets/upload_black.svg"
import { read_compressed_image } from '../js/read_compressed_image';
import { resetCompressedUpload } from "../js/reset_upload"
import useMediaQuery from "../hooks/useMediaQuery";
import { motion } from "framer-motion"

const CompressedBox = () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const c_hiddenFileInput = React.useRef(null)

    const handleClick = (event) => {
        c_hiddenFileInput.current.click();
    }

    const handleChange = (event) => {
        read_compressed_image(event.target.files[0]);
    }

    return (
        <>
            <motion.div 
                className={isDesktop ? "upload_image_div" : "upload_image_div_mobile"}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 1,
                    delay: 0.4,
                    ease: [0, 0.71, 0.2, 1.01]
                }}>
                <div className={isDesktop ? "upload_d_image_box" : "upload_d_image_box_mobile"} id="upload_d_image_box" onClick={handleClick}>
                    <div id="upload_d_image_text">
                        <h3>Upload arith© compressed image</h3>
                        <img className={isDesktop ? "upload_orange" : "upload_orange_mobile"} src={upload_orange}/>
                    </div>
                </div>
                <div className={isDesktop ? "d_image_canvas" : "d_image_canvas_mobile"} id="d_image_canvas">
                    <canvas id="decompressed_canvas" className="decompressed_canvas"></canvas>
                </div>
                {/* upload image sidepanel */}
                <div className={isDesktop ? "upload_image_sidepanel" : ""}>
                    <button className={isDesktop ? "decompress_button" : "decompress_button_mobile"} id="decompress_button">
                        <a download="compressed_img.ppm" id="download_link2">
                            <h3 className={isDesktop ? "download_link_text" : "download_link_text_mobile"}>Download decompressed image</h3>
                        </a>
                    </button>
                    <div className={isDesktop ? "d_error_message" : "d_error_message_mobile"} id="d_error_message">
                        <h3>...</h3>
                    </div>
                    <div className={isDesktop ? "upload_d_another" : "upload_d_another_mobile"} id="upload_d_another">
                        <h3 onClick={resetCompressedUpload} className="upload_image_sidepanel_text">
                            or upload another arith© compressed image
                        </h3>
                        <img className={isDesktop ? "upload_black" : "upload_black_mobile"} id="upload_black" src={upload_black}/>
                    </div>
                    <h3 className={isDesktop ? "hover_hint" : "hover_hint_mobile"} id="hover_hint">✶ Hover over the image for a surprise!</h3>
                    <div className={isDesktop ? "inspection" : "inspection_mobile"} id="inspection">
                        <div id="hovered_color_original_div">
                            <h3 className={isDesktop ? "hovered_color_original_text" : "hovered_color_original_text_mobile"} id="hovered_color_original_text"></h3>
                            <div className={isDesktop ? "hovered_color_original" : "hovered_color_original_mobile"} id="hovered_color_original"></div>
                            <canvas className={isDesktop ? "hovered_zoom_original" : "hovered_zoom_original_mobile"} id="hovered_zoom_original"></canvas>
                        </div>
                        <div id="hovered_color_decompressed_div">
                            <h3 className={isDesktop ? "hovered_color_decompressed_text" : "hovered_color_decompressed_text_mobile"} id="hovered_color_decompressed_text"></h3>
                            <div className={isDesktop ? "hovered_color_decompressed" : "hovered_color_decompressed_mobile"} id="hovered_color_decompressed"></div>
                            <canvas className={isDesktop ? "hovered_zoom_decompressed" : "hovered_zoom_decompressed_mobile"} id="hovered_zoom_decompressed"></canvas>
                        </div>
                    </div>
                </div>
            </motion.div>
            {/* always hidden */}
            <input type="file"
                id="compressed_file"
                className="upload_image_input"
                onChange={handleChange}
                ref={c_hiddenFileInput}
            />
        </>
    )
}

export default CompressedBox;