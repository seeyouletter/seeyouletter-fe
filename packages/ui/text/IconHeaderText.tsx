import { PropsWithChildren, ReactElement } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { StackProps } from '@chakra-ui/react';

import { DefaultHStack } from '@ui/stack';

interface StyledHeaderTextInterface extends PropsWithChildren {
  textPaddingTop: string;
}

interface IconHeaderTextPropsInterface
  extends PropsWithChildren,
    StyledHeaderTextInterface,
    Omit<StackProps, 'inline'> {
  Icon: ReactElement;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  marginTop?: number;
  marginBottom?: number;
}

const StyledText = styled.div<StyledHeaderTextInterface>`
  ${({ textPaddingTop }) =>
    textPaddingTop &&
    css`
      padding-top: ${textPaddingTop};
    `}
`;

export function IconHeaderText({
  Icon,
  level,
  children,
  marginTop,
  marginBottom,
  /**
   * @inner testPaddingTop - 텍스트가 가끔 폰트 규격으로 인해 중앙으로 오지 않는 경우, 패딩으로 조절한다.
   */
  textPaddingTop = 'auto',
  ...props
}: IconHeaderTextPropsInterface) {
  return (
    <DefaultHStack spacing={2} marginTop={marginTop} marginBottom={marginBottom} {...props}>
      {Icon}
      <StyledText as={level} textPaddingTop={textPaddingTop}>
        {children}
      </StyledText>
    </DefaultHStack>
  );
}
