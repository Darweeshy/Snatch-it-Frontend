import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlider = ({ banners }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying || !banners || banners.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentSlide, isAutoPlaying, banners]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    if (!banners || banners.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-2xl group">
            {/* Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                            ? 'opacity-100 transform scale-100'
                            : 'opacity-0 transform scale-105'
                        }`}
                    style={{
                        backgroundColor: banner.backgroundColor || '#2D3142',
                    }}
                >
                    {/* Background Image */}
                    {banner.imageUrl && (
                        <div className="absolute inset-0">
                            <img
                                src={banner.imageUrl}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="relative h-full flex items-center">
                        <div className="container mx-auto px-4 md:px-8 lg:px-16">
                            <div className="max-w-2xl">
                                <h1
                                    className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 animate-fade-in-up"
                                    style={{ color: banner.textColor || '#FFFFFF' }}
                                >
                                    {banner.title}
                                </h1>
                                {banner.subtitle && (
                                    <p
                                        className="text-lg md:text-2xl mb-6 md:mb-8 animate-fade-in-up animation-delay-200"
                                        style={{ color: banner.textColor || '#F3F4F6' }}
                                    >
                                        {banner.subtitle}
                                    </p>
                                )}
                                {banner.linkUrl && (
                                    <Link
                                        to={banner.linkUrl}
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#EF8354] to-[#F4A261] text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-400"
                                    >
                                        {banner.ctaText || 'Shop Now'}
                                        <ChevronRight className="ml-2 w-5 h-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                </>
            )}

            {/* Dots Navigation */}
            {banners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroSlider;
