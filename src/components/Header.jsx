import "../styles/Header.css"
import arith_logo from "../assets/arith_logo.svg"
import arith_wordmark from "../assets/arith_wordmark.svg"
import info_icon from "../assets/info_icon.svg"
import useMediaQuery from "../hooks/useMediaQuery"

const Header = () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <div className="header">
            <div className="header_info">
                <div className="header_left">
                    <img src={arith_wordmark} className={isDesktop ? "arith_logo" : "arith_logo_mobile"}/>
                    {/* <h3 id="header_text">is a ppm compressor/decompressor.</h3> */}
                </div>
                    <a href="#info"><img src={info_icon} className={isDesktop ? "info_icon" : "info_icon_mobile"}/></a>
            </div>
            <hr className={isDesktop ? "hr" : "hr_mobile"}></hr>
        </div>
    )
}

export default Header