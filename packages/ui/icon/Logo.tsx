import React from 'react';

import { getIconSize } from '@ui/utils/getIconSize';

import { Icon } from './Default';
import { IconInterface } from './types';

export function Logo({ size = '24px' }: IconInterface) {
  const { width, height } = getIconSize({
    originalWidth: 24,
    originalHeight: 24,
    size: size,
  });

  return (
    <Icon viewBox="0 0 24 24" width={width} height={height}>
      <rect width="24" height="24" fill="url(#pattern0)" />
      <defs>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_1_403" transform="scale(0.00775194)" />
        </pattern>
        <image
          id="image0_1_403"
          width="129"
          height="129"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </Icon>
  );
}
