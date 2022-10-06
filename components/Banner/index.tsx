import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './styles.module.css';

import { Autoplay } from "swiper";
import 'swiper/css';

export default function Banner() {
    return (
        <div className={styles.container}>
            <Swiper
                slidesPerView={1}
                className={styles.swiper}
                autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                }}
                loop={true}
                modules={[Autoplay]}
            >
                <SwiperSlide className={styles.slide}><img src="./tmp/group1.png" alt=""/></SwiperSlide>
                <SwiperSlide className={styles.slide}><img src="/tmp/group2.png" alt=""/></SwiperSlide>     
            </Swiper>
        </div>
    )
}