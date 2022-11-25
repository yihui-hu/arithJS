import "../styles/Info.css"
import useMediaQuery from "../hooks/useMediaQuery"

const Info = () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <div className={isDesktop ? "info" : "info_mobile"} id="info">
            <div className={isDesktop ? "info_card_div" : "info_card_div_mobile"}>
                <div className={isDesktop ? "info_card_left" : "info_card_left_mobile"}>
                    <h3>ⓘ Info</h3>
                    <br></br>
                    <h4 className="header_text">Origin of the project</h4>
                    <hr></hr>
                    <h4>arith started as a CLI image compressor / decompressor that my friend Toby and I built in C for a college class. It was a cool enough project for me to want to put on the web. But I couldn't figure out how to get C code to run on a server, so I ported all the code over to JavaScript. It took about a week of all-nighters.
                    </h4>
                    <br></br>
                    <h4 className="header_text">What is a ppm file?</h4>
                    <hr></hr>
                    <h4>PPM stands for Portable Pixmap Format. It's essentially another image format not unlike png or jpg. It's good for data parsing because ppm images store the RGB values of pixels (or representations of it) in plaintext. It's not practical outside of that because they're huge in size and "egregiously inefficient". You can read more about the format <a className="link" href="https://netpbm.sourceforge.net/doc/ppm.html" target="_blank">here</a>.
                    </h4>
                    <br></br>
                    <h4 className="header_text">How does it work?</h4>
                    <hr></hr>
                    <h4>The compression algorithm relies on bitpacking, quantization, as well as discrete cosine transformations. Briefly speaking, a ppm (P6) image is read in and processed, and information not easily discernable by the naked eye is discarded. At the end, what info remains about a single pixel is packed into 1 byte instead of, say, 4-8 bytes. So that's quite a lot of space saved!
                    </h4>
                    <br></br>
                    <h4 className="header_text">Source files?</h4>
                    <hr></hr>
                    <h4>Source files / Github repo available soon. Let me clean up my mess first...
                    </h4>
                    <br></br>
                    <h4 className="header_text">There's an issue / bug...</h4>
                    <hr></hr>
                    <h4>Sorry about that. Please let me know via email, yyihui.hu (at) gmail.com.</h4>
                </div>
                <div className={isDesktop ? "info_card_right" : "info_card_right_mobile"}>
                    <h3>✎ Notes</h3>
                    <br></br>
                    <h4 className="header_text">Performance differences from C</h4>
                    <hr></hr>
                    <h4>I have not rigorously tested the JS implementation against the original C code, but from what little testing I did, the JS implementation, with no optimization, seemed to run between ~10-28x slower than C. Timing results available <a className="link"href="https://gist.github.com/yihui-hu/484c31bdbf6a73192b8044aa67a0972e" target="_blank">here</a>.
                    </h4>
                    <br></br>
                    <h4 className="header_text">On porting C code to JavaScript</h4>
                    <hr></hr>
                    <h4>JS has no built-in integer types, so manipulating bits is weird. I had to do it manually with strings: "101010". JS also doesn't have native support for reading / writing all 256 ASCII characters, so I had to design my own decoding table that mapped each value between 0-255 to a UTF-8 character. There are other quirks with porting C to JS; might do a more comprehensive write-up in a few.
                    </h4>
                    <br></br>
                    <h4 className="header_text">Decompressor produces a P3 ppm image? <br></br> Why not P6 like the original?</h4>
                    <hr></hr>
                    <h4>JS can't write ASCII characters above 127, at least not without a custom encoding table. Might get around to it some time later but I'm swamped with final projects. At least you get to see the RGB vals in plain text; feature, not bug :)
                    </h4>
                </div>
            </div>
        </div>
    )
}

export default Info