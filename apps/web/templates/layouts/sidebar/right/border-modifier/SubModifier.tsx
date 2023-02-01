import React from 'react';

import { useBorderMatrix, useBorderModifier } from '@hooks/index';

import { DefaultHStack, DefaultVStack, EdgeDirectionsContstants } from 'ui';

import { TemplatedColorInputWithTitlePresenter } from '../TemplatedColorInputWithTitle';
import { TemplatedInputWithTitlePresenter } from '../TemplatedInputWithTitlePresenter';

/**
 * @description
 * INFO: 보더를 설정함에 있어 모서리일 경우랑 선의 경우를 다르게 인터페이스를 가져갈 필요가 있었다.
 * 이를 좀 더 유연하게 설계하기 위해 팩토리 메서드 패턴을 사용했다.
 */
export function BorderSubModifierFactory() {
  const { blockBorderState } = useBorderMatrix();

  return blockBorderState.activeBorder in EdgeDirectionsContstants ? (
    <EdgeModifier />
  ) : (
    <LineModifier />
  );
}

function BorderRadiusInput() {
  const { activeSectionBorderRadius, setBorderRadiusMiddleWare } = useBorderModifier();
  return (
    <DefaultVStack spacing={2} paddingTop="4px">
      <DefaultHStack spacing={2}>
        <TemplatedInputWithTitlePresenter
          direction="vertical"
          inputWidth="42px"
          title="둥글기"
          placeholder="입력"
          value={activeSectionBorderRadius()}
          onChange={setBorderRadiusMiddleWare}
        />
      </DefaultHStack>
    </DefaultVStack>
  );
}

export function EdgeModifier() {
  return <BorderRadiusInput />;
}

export function LineModifier() {
  const {
    activeSectionBorderColor,
    activeSectionBorderOpacity,
    activeSectionBorderStyle,
    activeSectionBorderWidth,
    setBorderMiddleware,
  } = useBorderModifier();

  return (
    <DefaultVStack spacing={2} paddingTop="4px">
      <DefaultHStack spacing={2}>
        <TemplatedInputWithTitlePresenter
          direction="vertical"
          inputWidth="42px"
          title="두께"
          placeholder="입력"
          value={activeSectionBorderWidth()}
          onChange={(e) => setBorderMiddleware(e, 'width')}
        />

        <BorderRadiusInput />

        <TemplatedInputWithTitlePresenter
          direction="vertical"
          inputWidth="48px"
          title="스타일"
          placeholder="입력"
          value={activeSectionBorderStyle()}
          onChange={(e) => setBorderMiddleware(e, 'style')}
        />
      </DefaultHStack>

      <DefaultHStack spacing={2}>
        <TemplatedColorInputWithTitlePresenter
          direction="vertical"
          width="24px"
          title="색상"
          value={activeSectionBorderColor()}
          onChange={(e) => setBorderMiddleware(e, 'color')}
        />

        <TemplatedInputWithTitlePresenter
          direction="vertical"
          inputWidth="60px"
          title="색상번호"
          placeholder="입력"
          value={activeSectionBorderColor()}
          onChange={(e) => setBorderMiddleware(e, 'color')}
        />

        <TemplatedInputWithTitlePresenter
          direction="vertical"
          inputWidth="48px"
          title="투명도"
          placeholder="입력"
          value={activeSectionBorderOpacity()}
          onChange={(e) => setBorderMiddleware(e, 'opacity')}
        />
      </DefaultHStack>
    </DefaultVStack>
  );
}
