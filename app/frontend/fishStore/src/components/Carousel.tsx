
import { CircleDot } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Circle } from "react-feather";
import { LuArrowBigLeft, LuArrowBigRight } from 'react-icons/lu';

interface CarouselProps {
    images: {
        url:string,
        alt:string,
    }[]
    autoSlide?:boolean;
    autoSlideInterval?:number;

}


function Carousel({ images, autoSlide = false, autoSlideInterval = 3000 }: CarouselProps) {
    const [imageIndex, setImageIndex] = useState(0);

    function showPreviousImage() {
        setImageIndex(index => {
            if (index === 0) {
                return images.length - 1
            }
            return index - 1;
        })
    }

    function showNextImage() {
        setImageIndex(index => {
            if (index === images.length - 1) {
                return 0
            }
            return index + 1;
        })
    }

    useEffect(() => {
        if (!autoSlide) return;
        const slideInterval = setInterval(showNextImage, autoSlideInterval);
        return () => clearInterval(slideInterval);
    })
    return (
        <section aria-label='Image Carousel' style={{ width: "100%", height: "100%", position: "relative" }}>
            <a href ="#after-image-slider-controls" className='skip-link'>Skip image slider control</a>
            
            <div style={{ width: "100%", height: "100%", display: "flex", overflow:"hidden" }}>
                {images.map(({url, alt}, index) => (
                    <img key={url}
                    src={url}
                    className="img-slider-img"
                    alt = {alt}
                    aria-hidden = {imageIndex !== index}
                    style={{translate: `${-100 * imageIndex}%`}} 
                    />
                ))}
            </div>
            <button onClick={showPreviousImage} 
                className='img-slider-btn' 
                style={{ left: "0" }} 
                aria-label='View Previous Image'>
                    <LuArrowBigLeft aria-hidden/>
            </button>
            <button onClick={showNextImage} 
                className='img-slider-btn' 
                style={{ right: "0" }}
                aria-label='View Next Image'>
                    <LuArrowBigRight aria-hidden/>

            </button>
            <div style = {{
                position:"absolute",
                bottom:".5rem",
                left:"50%",
                translate:"-50%",
                display:"flex",
                gap: "0.25rem",

            }}>
                {images.map((_, index) => (
                    <button key = {index} className = "img-slider-dot-btn"  aria-label={`View Image ${index + 1}`} 
                        onClick={() => setImageIndex(index)}>{index === imageIndex ?
                             <CircleDot aria-hidden/>
                             :
                             <Circle aria-hidden/>}</button>
                )) }
            </div>
            <div id = "after-image-slider-controls"/>
        </section>
    );

}

export default Carousel;