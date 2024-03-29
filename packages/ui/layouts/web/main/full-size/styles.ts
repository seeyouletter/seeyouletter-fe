/**
 * NOTE:
 * pnpm에서 모노레포에 관한 심볼릭 링크 오류 관련해서 해결할 때까지 이 패턴을 유지한다.
 * 추후 해결될 시  `import type {}`을 통해 모든 문장을 제거한다.
 *
 * @see: https://github.com/microsoft/TypeScript/issues/47663
 */
import type {} from 'node_modules/@types/react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const StyledFullSizeMainContainer = styled.section<{
  isHeader: boolean;
  backgroundColor: string;
}>`
  position: relative;

  min-width: 100vw;

  height: 100%;
  min-height: 100vh;

  background-color: ${({ backgroundColor }) => backgroundColor};

  ${({ isHeader, theme }) =>
    isHeader &&
    css`
      padding-top: calc(
        ${theme.layout.header.height} + ${theme.layout.templateCreateToolbar.height}
      );
    `}
`;
