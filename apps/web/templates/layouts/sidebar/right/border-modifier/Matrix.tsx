import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTheme } from '@emotion/react';

import { DefaultBox, DefaultHStack, DefaultText, DefaultVStack, StrongText } from 'ui';

import {
  DirectionsContstants,
  EdgeDirectionsContstants,
  concurrentlyActivedSections,
} from '@atoms/blockBorderAtom';

import { useBorderMatrix } from '@hooks/index';

interface SubMatrixCommonPropsInterface {
  onMouseOverMatrix: (key: EdgeDirectionsContstants | DirectionsContstants | 'all') => void;
  onClickBorderSection: ({
    key,
  }: {
    key: EdgeDirectionsContstants | DirectionsContstants | 'all';
  }) => void;
  onBlurMatrix: () => void;
}

interface LineMatrixPropsInterface extends SubMatrixCommonPropsInterface {
  direction: 'vertical' | 'horizontal';
  actived: boolean;
  position: DirectionsContstants;
}

interface EdgeMatrixPropsInterface extends SubMatrixCommonPropsInterface {
  actived: boolean;
  position: EdgeDirectionsContstants;
}

const initialmatrixState = {
  topLeft: false,
  top: false,
  topRight: false,
  left: false,
  right: false,
  bottomLeft: false,
  bottom: false,
  bottomRight: false,
};

const EdgeMatrix = ({
  actived,
  position,
  onMouseOverMatrix,
  onClickBorderSection,
  onBlurMatrix,
}: EdgeMatrixPropsInterface) => {
  const theme = useTheme();

  return (
    <DefaultBox
      border="0.5px solid white"
      width="20px"
      height="20px"
      backgroundColor={actived ? theme.color.primary[500] : theme.color.transparent}
      transition="all 0.2s"
      cursor="pointer"
      onMouseOver={() => onMouseOverMatrix(EdgeDirectionsContstants[position])}
      onMouseLeave={onBlurMatrix}
      onClick={() => onClickBorderSection({ key: EdgeDirectionsContstants[position] })}
    />
  );
};

const LineMatrix = ({
  direction,
  actived,
  position,
  onMouseOverMatrix,
  onClickBorderSection,
  onBlurMatrix,
}: LineMatrixPropsInterface) => {
  const theme = useTheme();

  const BorderName = {
    top: '상',
    bottom: '하',
    left: '좌',
    right: '우',
  };

  return (
    <DefaultBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      border="0.5px solid white"
      width={direction === 'vertical' ? '20px' : '32px'}
      height={direction === 'vertical' ? '32px' : '20px'}
      backgroundColor={actived ? theme.color.primary[500] : theme.color.transparent}
      transition="all 0.2s"
      cursor="pointer"
      onMouseOver={() => onMouseOverMatrix(DirectionsContstants[position])}
      onMouseLeave={onBlurMatrix}
      onClick={() => onClickBorderSection({ key: DirectionsContstants[position] })}
    >
      <DefaultText textAlign="center" size={theme.fontSize.xs} color={theme.color.white}>
        {BorderName[position]}
      </DefaultText>
    </DefaultBox>
  );
};

export function BorderMatrix() {
  const theme = useTheme();
  const { blockBorderState, onClickBorderSection } = useBorderMatrix();

  const [activedState, setActivedState] = useState(initialmatrixState);

  const activedAll = useMemo(() => {
    return Object.values(activedState).every((v) => v);
  }, [activedState]);

  const setActiveSections = useCallback(() => {
    const nextState = { ...initialmatrixState };

    blockBorderState.concurrentlyActivedSection.forEach((section) => {
      nextState[section] = true;
    });

    setActivedState(() => nextState);
  }, [blockBorderState]);

  useEffect(() => {
    setActiveSections();
  }, [setActiveSections]);

  const onMouseOverMatrix = (key: EdgeDirectionsContstants | DirectionsContstants | 'all') => {
    const nextState = { ...initialmatrixState };

    const concurrencies = concurrentlyActivedSections[key];

    concurrencies.forEach((concurrent) => (nextState[concurrent] = true));

    setActivedState(() => nextState);
  };

  const onBlurMatrix = () => {
    setActiveSections();
  };

  return (
    <DefaultVStack spacing={1} id="테두리">
      <DefaultBox width="72px">
        <StrongText size={theme.fontSize.xs} color="white">
          테두리
        </StrongText>
      </DefaultBox>

      <DefaultVStack>
        <DefaultHStack>
          <EdgeMatrix
            actived={activedState[EdgeDirectionsContstants.topLeft]}
            position={EdgeDirectionsContstants.topLeft}
            onMouseOverMatrix={onMouseOverMatrix}
            onBlurMatrix={onBlurMatrix}
            onClickBorderSection={onClickBorderSection}
          />

          <LineMatrix
            direction="horizontal"
            actived={activedState[DirectionsContstants.top]}
            position={DirectionsContstants.top}
            onMouseOverMatrix={onMouseOverMatrix}
            onBlurMatrix={onBlurMatrix}
            onClickBorderSection={onClickBorderSection}
          />

          <EdgeMatrix
            actived={activedState[EdgeDirectionsContstants.topRight]}
            position={EdgeDirectionsContstants.topRight}
            onMouseOverMatrix={onMouseOverMatrix}
            onBlurMatrix={onBlurMatrix}
            onClickBorderSection={onClickBorderSection}
          />
        </DefaultHStack>

        <DefaultHStack>
          <LineMatrix
            direction="vertical"
            actived={activedState[DirectionsContstants.left]}
            position={DirectionsContstants.left}
            onMouseOverMatrix={onMouseOverMatrix}
            onBlurMatrix={onBlurMatrix}
            onClickBorderSection={onClickBorderSection}
          />

          <DefaultBox
            border="0.5px solid white"
            width="32px"
            height="32px"
            backgroundColor={activedAll ? theme.color.primary[500] : theme.color.transparent}
            onMouseOver={() => onMouseOverMatrix('all')}
            onMouseLeave={onBlurMatrix}
            onClick={() => onClickBorderSection({ key: 'all' })}
          />

          <LineMatrix
            direction="vertical"
            actived={activedState[DirectionsContstants.right]}
            position={DirectionsContstants.right}
            onMouseOverMatrix={onMouseOverMatrix}
            onBlurMatrix={onBlurMatrix}
            onClickBorderSection={onClickBorderSection}
          />
        </DefaultHStack>

        <DefaultHStack>
          <EdgeMatrix
            actived={activedState[EdgeDirectionsContstants.bottomLeft]}
            position={EdgeDirectionsContstants.bottomLeft}
            onMouseOverMatrix={onMouseOverMatrix}
            onBlurMatrix={onBlurMatrix}
            onClickBorderSection={onClickBorderSection}
          />

          <LineMatrix
            direction="horizontal"
            actived={activedState[DirectionsContstants.bottom]}
            position={DirectionsContstants.bottom}
            onMouseOverMatrix={onMouseOverMatrix}
            onBlurMatrix={onBlurMatrix}
            onClickBorderSection={onClickBorderSection}
          />

          <EdgeMatrix
            actived={activedState[EdgeDirectionsContstants.bottomRight]}
            position={EdgeDirectionsContstants.bottomRight}
            onMouseOverMatrix={onMouseOverMatrix}
            onBlurMatrix={onBlurMatrix}
            onClickBorderSection={onClickBorderSection}
          />
        </DefaultHStack>
      </DefaultVStack>
    </DefaultVStack>
  );
}