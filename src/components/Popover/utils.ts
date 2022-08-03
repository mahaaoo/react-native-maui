import { Position, Layout, Placement, ArrowPlacement } from './type';

const getPosition = (
  position: Position,
  layout: Layout,
  arrowSize: number,
  arrowColor: string,
  placement: Placement,
  arrowPosition: ArrowPlacement
) => {
  const { width: w, height: h } = layout;
  const { width, height, pageX, pageY } = position;

  let top = 0;
  let left = 0;

  let arrow = {};

  switch (true) {
    case placement === 'top-start' ||
      placement === 'top' ||
      placement === 'top-end': {
      top = pageY - h - 2 * arrowSize;
      if (placement === 'top-start') {
        left = pageX;
      }
      if (placement === 'top') {
        left = pageX - (w - width) / 2;
      }
      if (placement === 'top-end') {
        left = pageX - (w - width);
      }

      arrow = {
        borderTopColor: arrowColor,
        top: pageY - 2 * arrowSize,
      };

      if (arrowPosition === 'start') {
        arrow = {
          ...arrow,
          left: pageX + arrowSize,
        };
      }
      if (arrowPosition === 'center') {
        arrow = {
          ...arrow,
          left: pageX + width / 2 - arrowSize,
        };
      }

      if (arrowPosition === 'end') {
        arrow = {
          ...arrow,
          left: pageX + width - 2 * arrowSize,
        };
      }

      break;
    }
    case placement === 'bottom-start' ||
      placement === 'bottom' ||
      placement === 'bottom-end': {
      top = pageY + height + 2 * arrowSize;

      if (placement === 'bottom-start') {
        left = pageX;
      }
      if (placement === 'bottom') {
        left = pageX - (w - width) / 2;
      }
      if (placement === 'bottom-end') {
        left = pageX - (w - width);
      }

      arrow = {
        borderBottomColor: arrowColor,
        top: pageY + height,
      };

      if (arrowPosition === 'start') {
        arrow = {
          ...arrow,
          left: pageX + arrowSize,
        };
      }
      if (arrowPosition === 'center') {
        arrow = {
          ...arrow,
          left: pageX + width / 2 - arrowSize,
        };
      }

      if (arrowPosition === 'end') {
        arrow = {
          ...arrow,
          left: pageX + width - 2 * arrowSize,
        };
      }
      break;
    }
    case placement === 'left-start' ||
      placement === 'left' ||
      placement === 'left-end': {
      left = pageX - w - 2 * arrowSize;

      if (placement === 'left-start') {
        top = pageY;
      }
      if (placement === 'left') {
        top = pageY - (h - height) / 2;
      }
      if (placement === 'left-end') {
        top = pageY - (h - height);
      }

      arrow = {
        borderLeftColor: arrowColor,
        left: pageX - 2 * arrowSize,
      };

      if (arrowPosition === 'start') {
        arrow = {
          ...arrow,
          top: pageY,
        };
      }
      if (arrowPosition === 'center') {
        arrow = {
          ...arrow,
          top: pageY + height / 2 - arrowSize,
        };
      }

      if (arrowPosition === 'end') {
        arrow = {
          ...arrow,
          top: pageY + height - 2 * arrowSize,
        };
      }

      break;
    }
    case placement === 'right-start' ||
      placement === 'right' ||
      placement === 'right-end': {
      left = pageX + width + 2 * arrowSize;
      if (placement === 'right-start') {
        top = pageY;
      }
      if (placement === 'right') {
        top = pageY - (h - height) / 2;
      }
      if (placement === 'right-end') {
        top = pageY - (h - height);
      }

      arrow = {
        borderRightColor: arrowColor,
        left: pageX + width,
      };

      if (arrowPosition === 'start') {
        arrow = {
          ...arrow,
          top: pageY,
        };
      }
      if (arrowPosition === 'center') {
        arrow = {
          ...arrow,
          top: pageY + height / 2 - arrowSize,
        };
      }

      if (arrowPosition === 'end') {
        arrow = {
          ...arrow,
          top: pageY + height - 2 * arrowSize,
        };
      }
      break;
    }
  }
  const popover = { top, left };
  return {
    popover,
    arrow,
  };
};

export { getPosition };
