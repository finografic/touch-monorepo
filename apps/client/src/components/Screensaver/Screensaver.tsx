import type { CSSProperties, FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { ADMIN_SCREENSAVER_INACTIVITY_MS, ADMIN_SCREENSAVER_TRANSITION_MS } from 'config/app';
import { useGetImageFiles, useGetImageSettings } from 'queries/images';
import { getImageFilePublicUrl } from 'utils/imageUrls';

import { useScreensaver } from './useScreensaver';
import { overlayStyles } from './Screensaver.styles';

const SCREENSAVER_IMAGE_SPEED_PX_PER_SEC = 18;
const SCREENSAVER_IMAGE_SIZE_VW = 24;
const SCREENSAVER_IMAGE_SIZE_VH = 24;

export interface ScreensaverProps {
  /**
   * Milliseconds without pointer/keyboard/scroll activity before the overlay appears.
   * @default ADMIN_SCREENSAVER_INACTIVITY_MS (5 minutes)
   */
  inactivityMs?: number;
}

/**
 * Full-viewport idle overlay: fixed layer over the app (not the browser Fullscreen API).
 * Dismisses on activity at window/document level. Idle countdown only when `selectedSlots` and `timers` are both empty.
 */
export const Screensaver: FC<ScreensaverProps> = ({
  inactivityMs = ADMIN_SCREENSAVER_INACTIVITY_MS,
}) => {
  const { visible } = useScreensaver(inactivityMs);
  const [present, setPresent] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { data: imageSettings } = useGetImageSettings();
  const { data: productImages } = useGetImageFiles('product');
  const { data: labelImages } = useGetImageFiles('label');

  const screensaverImageSrc = useMemo(() => {
    const productSelected = imageSettings?.product
      ? productImages?.find((image) => image.id === imageSettings.product)
      : undefined;

    if (productSelected?.filePath) {
      return getImageFilePublicUrl(productSelected.filePath);
    }

    const labelSelected = imageSettings?.label
      ? labelImages?.find((image) => image.id === imageSettings.label)
      : undefined;

    return labelSelected?.filePath ? getImageFilePublicUrl(labelSelected.filePath) : null;
  }, [imageSettings, labelImages, productImages]);

  useEffect(function updateVisibility() {
    if (visible) {
      setPresent(true);
      const frameId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOpacity(1);
        });
      });

      return () => {
        cancelAnimationFrame(frameId);
      };
    }

    setOpacity(0);
    const hideTimerId = window.setTimeout(() => {
      setPresent(false);
    }, ADMIN_SCREENSAVER_TRANSITION_MS);

    return () => {
      window.clearTimeout(hideTimerId);
    };
  }, [visible]);

  useEffect(function animateScreensaverImage() {
    if (!visible || !screensaverImageSrc || !imageRef.current) {
      return;
    }

    const image = imageRef.current;
    let frameId = 0;
    let lastTimestamp = 0;

    const initialAngle = Math.random() * Math.PI * 2;
    let velocityX = Math.cos(initialAngle) * SCREENSAVER_IMAGE_SPEED_PX_PER_SEC;
    let velocityY = Math.sin(initialAngle) * SCREENSAVER_IMAGE_SPEED_PX_PER_SEC;
    let positionX = 0;
    let positionY = 0;

    const placeAtRandomStart = () => {
      const imageRect = image.getBoundingClientRect();
      const imageWidth = imageRect.width || 300;
      const imageHeight = imageRect.height || 180;
      positionX = Math.random() * Math.max(0, window.innerWidth - imageWidth);
      positionY = Math.random() * Math.max(0, window.innerHeight - imageHeight);
      image.style.transform = `translate3d(${positionX}px, ${positionY}px, 0)`;
    };

    const animate = (timestamp: number) => {
      if (!image.isConnected) {
        return;
      }

      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const imageRect = image.getBoundingClientRect();
      const imageWidth = imageRect.width || 300;
      const imageHeight = imageRect.height || 180;
      const maxX = Math.max(0, window.innerWidth - imageWidth);
      const maxY = Math.max(0, window.innerHeight - imageHeight);

      positionX += velocityX * deltaSeconds;
      positionY += velocityY * deltaSeconds;

      if (positionX <= 0) {
        positionX = 0;
        velocityX = Math.abs(velocityX);
      } else if (positionX >= maxX) {
        positionX = maxX;
        velocityX = -Math.abs(velocityX);
      }

      if (positionY <= 0) {
        positionY = 0;
        velocityY = Math.abs(velocityY);
      } else if (positionY >= maxY) {
        positionY = maxY;
        velocityY = -Math.abs(velocityY);
      }

      image.style.transform = `translate3d(${positionX}px, ${positionY}px, 0)`;
      frameId = requestAnimationFrame(animate);
    };

    placeAtRandomStart();
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [screensaverImageSrc, visible]);

  if (!present || typeof document === 'undefined') {
    return null;
  }

  const overlayStyle: CSSProperties = {
    opacity,
    transition: `opacity ${ADMIN_SCREENSAVER_TRANSITION_MS}ms ease`,
    pointerEvents: visible ? 'auto' : 'none',
  };

  return createPortal(
    <div
      css={overlayStyles}
      style={overlayStyle}
      aria-hidden="true"
      role="presentation"
      data-screensaver=""
    >
      {screensaverImageSrc && (
        <img
          ref={imageRef}
          src={screensaverImageSrc}
          alt=""
          style={{
            position: 'absolute',
            maxWidth: `${SCREENSAVER_IMAGE_SIZE_VW}vw`,
            maxHeight: `${SCREENSAVER_IMAGE_SIZE_VH}vh`,
            objectFit: 'contain',
            pointerEvents: 'none',
            willChange: 'transform',
            display: 'block',
          }}
        />
      )}
    </div>,
    document.body,
  );
};
