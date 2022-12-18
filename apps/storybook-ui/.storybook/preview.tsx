import React from 'react';

import {ThemeProvider} from '@emotion/react';
import { CustomThemeProvider, globalTheme } from 'ui';

import { viewports, MINIMAL_VIEWPORTS, DEFAULT_VIEWPORT } from './viewPortsMap';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewport: {
    viewports: {
      ...DEFAULT_VIEWPORT,
      ...viewports,
      ...MINIMAL_VIEWPORTS
    },
    defaultViewport: 'responsive',
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

/**
 * @description
 * don't use addon @chakra-ui/storybook-addon.
 * It cannot use in builder-vite now. (22.12.15)
 *
 * @see: https://github.com/chakra-ui/chakra-ui/issues/6433
 */
// add chakra provider in storybook
export const decorators = [
  (Story) => (
    <CustomThemeProvider>
      <Story />
    </CustomThemeProvider>
  ),
];
