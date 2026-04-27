import type { CSSProperties, FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { ADMIN_SCREENSAVER_INACTIVITY_MS, ADMIN_SCREENSAVER_TRANSITION_MS } from 'config/app';
import { useGetImageFiles, useGetImageSettings } from 'queries/images';
import { getImageFilePublicUrl } from 'utils/imageUrls';

import { useScreensaver } from './useScreensaver';
import { overlayStyles } from './Screensaver.styles';

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
          src={screensaverImageSrc}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            margin: 'auto',
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>,
    document.body,
  );
};
