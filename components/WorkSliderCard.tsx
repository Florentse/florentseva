"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styles from "./WorkSliderCard.module.css";
import { urlFor } from "@/sanity/lib/image";

type WorkSliderCardProps = {
  title: string;
  slug: string;
  cardImages?: any[];
  cardDescription?: string;
  services?: string[];
};

export default function WorkSliderCard({
  title,
  slug,
  cardImages,
  cardDescription,
  services,
}: WorkSliderCardProps) {
  return (
    <div className={styles.worksItem}>
      <Swiper
        className={styles.swiper}
        spaceBetween={16}
        breakpoints={{
          0: {
            slidesPerView: 1.25,
          },
          768: {
            slidesPerView: 2.67,
          },
          1024: {
            slidesPerView: 3.15,
          },
        }}
      >
        {cardImages?.map((image, index) => (
          <SwiperSlide key={index}>
            <div className={styles.worksImageWrap}>
              <img
                src={urlFor(image).url()}
                alt={`${title} ${index + 1}`}
                className={styles.image}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <a href={`/works/${slug}`} className={`${styles.worksInfoWrap} grid-2 gap-small`}>
        <div className={styles.worksInfoGrid}>
          <span className="text-size-base text-color-tertiary">Project</span>
          <div className={styles.worksInfoColumn}>
            <h3 className="text-size-large">{title}</h3>
            {services && services.length > 0 && (
              <ul className={styles.servicesList}>
                {services.map((service, index) => (
                  <li
                    key={index}
                    className="text-size-small text-color-secondary text-transform-uppercase"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex-col gap-small">
          {cardDescription && <p>{cardDescription}</p>}
          <span className="text-size-base link-icon">View details</span>
        </div>
      </a>
    </div>
  );
}
