import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface WeChatPopoverProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export const WeChatPopover: React.FC<WeChatPopoverProps> = ({ anchorEl, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [coords, setCoords] = useState<{
    x: number;
    y: number;
    placement: "top" | "bottom";
    beakOffset: number;
  } | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!anchorEl) {
      setCoords(null);
      return;
    }

    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect();
      const popoverWidth = 200;
      const popoverHeight = 200;
      const margin = 10;

      const spaceAbove = rect.top;
      const placement: "top" | "bottom" = spaceAbove >= popoverHeight + margin ? "top" : "bottom";

      const anchorCenterX = rect.left + rect.width / 2;
      const left = anchorCenterX - popoverWidth / 2;

      const padding = 16;
      const clampedLeft = Math.max(padding, Math.min(window.innerWidth - popoverWidth - padding, left));
      const beakOffset = anchorCenterX - (clampedLeft + popoverWidth / 2);

      const y = placement === "top" ? rect.top - margin : rect.bottom + margin;

      setCoords({
        x: clampedLeft + popoverWidth / 2,
        y,
        placement,
        beakOffset,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    const onScroll = () => {
      handleClose();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", onScroll);
    };
  }, [anchorEl]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  useEffect(() => {
    if (!anchorEl) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target) && !anchorEl.contains(target)) {
        handleClose();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [anchorEl, isClosing]);

  if (!anchorEl || !coords) return null;

  const isTop = coords.placement === "top";

  return ReactDOM.createPortal(
    <div
      ref={popoverRef}
      className={`wechat-bubble-popover ${isTop ? "place-top" : "place-bottom"} ${
        isClosing ? "is-retracting" : "is-popping"
      }`}
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
      }}
      role="tooltip"
      aria-label="WeChat QR Code"
    >
      <div className="wechat-qr-card-direct">
        <img
          src="assets/wechat-official-account.png"
          alt="WeChat QR code"
          width={188}
          height={188}
          className="wechat-qr-img-direct"
        />
      </div>

      {/* Direct white beak / caret */}
      <div
        className="wechat-bubble-beak-direct"
        style={{
          transform: `translateX(calc(-50% + ${coords.beakOffset}px)) rotate(45deg)`,
        }}
        aria-hidden="true"
      />
    </div>,
    document.body
  );
};
