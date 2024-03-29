import React, { MouseEvent as ReactMouseEvent, useEffect, useState } from 'react';

import { useTheme } from '@emotion/react';

import { TaskTypeEnum } from '@models/index';

import { useBlockGroupsAtom, useResizablePageAtom, useTemplateTaskHistories } from '@hooks/index';

import { convertPxStringToNumber } from '@utils/index';

import {
  Blocks,
  DefaultBox,
  Directions,
  DirectionsConstants,
  EdgeDirections,
  EdgeDirectionsConstants,
  GroupBlockSize,
  NonTextBlock,
  Position,
  TextBlock,
} from 'ui';

import { NodeItemPropsInterface } from '../types';
import { EdgeInterface, LineInterface } from './types';
import {
  edgeCursors,
  edgeLefts,
  edgeTops,
  lineCursors,
  lineHeights,
  lineLefts,
  lineTops,
  lineWidths,
} from './utils';

function UpdatorLine({ direction, onMouseDown, onMouseUp }: LineInterface) {
  const theme = useTheme();

  return (
    <DefaultBox
      cursor={lineCursors[direction]}
      position="absolute"
      zIndex={9999}
      left={lineLefts[direction]}
      top={lineTops[direction]}
      width={lineWidths[direction]}
      height={lineHeights[direction]}
      background={theme.color.primary[200]}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    />
  );
}

function UpdatorEdge({ direction, onMouseDown, onMouseUp }: EdgeInterface) {
  const theme = useTheme();

  return (
    <DefaultBox
      cursor={edgeCursors[direction]}
      position="absolute"
      zIndex={10000}
      left={edgeLefts[direction]}
      top={edgeTops[direction]}
      width="6px"
      height="6px"
      background={theme.color.white}
      border={theme.border.primaryLight}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    />
  );
}

export function Updator({ item }: { item: NodeItemPropsInterface['item'] }) {
  const { activedBlockGroup, changeBlockState } = useBlockGroupsAtom();
  const { pageState } = useResizablePageAtom();

  const { addTask } = useTemplateTaskHistories();

  const [isMousePressing, setIsMousePressing] = useState(false);
  const [nowUpdate, setNowUpdate] = useState<EdgeDirectionsConstants | DirectionsConstants | null>(
    null
  );

  const [blockSnapshot, setBlockSnapshot] = useState<Blocks | null>(null);

  const [isUpdating, setIsUpdating] = useState({
    top: false,
    right: false,
    bottom: false,
    left: false,
    topLeft: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
  });

  const initializeBlockSnapshot = () => {
    setBlockSnapshot(() => null);
  };

  const onMouseDown = (
    e: ReactMouseEvent,
    direction: EdgeDirectionsConstants | DirectionsConstants
  ) => {
    /**
     * @description
     * Updator의 Line은 Leaf들 위에 존재한다.
     * 이때, 전파를 막지 않는다면, onMouseDown을 하는 시점에서 이미 Leaf에서의 onMouseDown과, onMouseMove가 동시에 동작하게 된다.
     * 따라서 전파를 막아줌으로써 더이상 버블링을 하지 않도록 한다.
     */
    e.stopPropagation();

    if (activedBlockGroup?.type === 'group' || isMousePressing || isUpdating[direction]) return;

    setIsMousePressing(() => true);
    setBlockSnapshot(() => activedBlockGroup);
    setIsUpdating((state) => ({ ...state, [direction]: true }));
    setNowUpdate(() => direction);
  };

  const onMouseUp = (direction: EdgeDirections | Directions | null) => {
    if (!isMousePressing || !direction || !isUpdating[direction]) return;

    addTask({
      taskType: TaskTypeEnum.update,
      before: item,
      after: activedBlockGroup,
    });

    setIsMousePressing(() => false);
    initializeBlockSnapshot();
    setIsUpdating((state) => ({ ...state, [direction]: false }));
    setNowUpdate(() => null);
  };

  const getActiveBlockNextState = ({
    block,
    nextSize = {},
    nextPosition = {},
  }: {
    block: Blocks;
    nextSize: Partial<GroupBlockSize>;
    nextPosition: Partial<Position>;
  }) => {
    return {
      ...block,
      style: {
        ...block.style,
        size: {
          ...block.style.size,
          ...nextSize,
        },
        position: {
          ...block.style.position,
          ...nextPosition,
        },
      },
    };
  };

  /**
   * @description
   * 각 상/하/좌/우의 값을 구하는 유틸함수입니다.
   * 계산에 있어 상태값을 계속해서 업데이트해야 하기에 컴포넌트 내부에서 사용하였습니다.
   *
   * NOTE: 추후 재사용성의 가능성이 있다면 훅으로 사용할 여지도 검토하고 있습니다.
   */
  const getNextFromTop = (y: number): { nextTop: number; nextBottom: number } => {
    if (blockSnapshot?.type !== 'block') {
      return {
        nextTop: 0,
        nextBottom: 0,
      };
    }

    const initialBlockTop = convertPxStringToNumber(blockSnapshot.style.position.top);
    const initialBlockHeight = convertPxStringToNumber(blockSnapshot.style.size.height);

    const nextTop = y - +pageState.top + pageState.scrollY;
    const nextBottom = initialBlockHeight + initialBlockTop;

    const isReversed = nextTop > nextBottom;

    return {
      nextTop: isReversed ? nextBottom : nextTop,
      nextBottom: isReversed ? nextTop : nextBottom,
    };
  };

  const getNextFromRight = (x: number): { nextLeft: number; nextRight: number } => {
    if (blockSnapshot?.type !== 'block') {
      return {
        nextLeft: 0,
        nextRight: 0,
      };
    }

    const initialBlockLeft = convertPxStringToNumber(blockSnapshot.style.position.left);
    const nowRight = x - +pageState.left;

    const isReversed = nowRight < initialBlockLeft;

    return {
      nextLeft: isReversed ? nowRight : initialBlockLeft,
      nextRight: isReversed ? initialBlockLeft : nowRight,
    };
  };

  const getNextFromBottom = (y: number): { nextTop: number; nextBottom: number } => {
    if (blockSnapshot?.type !== 'block') {
      return {
        nextTop: 0,
        nextBottom: 0,
      };
    }

    const nextTop = convertPxStringToNumber(blockSnapshot.style.position.top);

    const nextBottom = y + pageState.scrollY - +pageState.top;

    const isReversed = nextBottom < nextTop;

    return {
      nextTop: isReversed ? nextBottom : nextTop,
      nextBottom: isReversed ? nextTop : nextBottom,
    };
  };

  const getNextFromLeft = (x: number): { nextLeft: number; nextRight: number } => {
    if (blockSnapshot?.type !== 'block') {
      return {
        nextLeft: 0,
        nextRight: 0,
      };
    }

    const activedBlockLeft = convertPxStringToNumber(blockSnapshot.style.position.left);
    const activedBlockWidth = convertPxStringToNumber(blockSnapshot.style.size.width);
    const activedRightLineFromLeft = activedBlockWidth + activedBlockLeft;

    const nowLeft = x - +pageState.left;

    const isReversed = nowLeft > activedRightLineFromLeft;

    return {
      nextLeft: isReversed ? activedRightLineFromLeft : nowLeft,
      nextRight: isReversed ? nowLeft : activedRightLineFromLeft,
    };
  };

  /**
   * INFO: Line Strategies
   * 각 상/하/좌/우의 라인에서 값을 업데이트하는 것을 담당하는 함수입니다.
   */
  const getNextStateStrategyFactory = (action: { type: Directions }) => {
    switch (action.type) {
      case DirectionsConstants.top: {
        return topLineStrategy;
      }
      case DirectionsConstants.right: {
        return rightLineStrategy;
      }
      case DirectionsConstants.bottom: {
        return bottomLineStrategy;
      }
      case DirectionsConstants.left: {
        return leftLineStrategy;
      }

      default: {
        return null;
      }
    }
  };

  const topLineStrategy = (e: MouseEvent, block: Blocks) => {
    /**
     * @inner
     * useMouseStateAtom으로 하지 않는 이유는, 현재 이벤트에서 가져오는 값이 훨씬 속도가 빠르기 때문이다.
     * throttle을 제거하더라도, mouseMove의 변수를 가져오는 속도는 생각보다 느리다.
     * 전역 상태의 값을 찾아야 하기 때문이다.
     *
     * 반면 해당 작업은 유저가 세밀하게 작업하기 때문에 속도에 대한 역치가 상당히 낮다.
     * 따라서 어쩔 수 없이 리플로우를 유발하더라도 사용한다.
     */
    const { nextTop, nextBottom } = getNextFromTop(e.clientY);
    const nextHeight = nextBottom - nextTop;

    return getActiveBlockNextState({
      block,
      nextSize: { height: nextHeight + 'px' },
      nextPosition: { top: nextTop + 'px' },
    });
  };

  const rightLineStrategy = (e: MouseEvent, block: Blocks) => {
    const { nextLeft, nextRight } = getNextFromRight(e.clientX);
    const nextWidth = nextRight - nextLeft;

    return getActiveBlockNextState({
      block,
      nextSize: { width: nextWidth + 'px' },
      nextPosition: { left: nextLeft + 'px' },
    });
  };

  const bottomLineStrategy = (e: MouseEvent, block: Blocks) => {
    const { nextTop, nextBottom } = getNextFromBottom(e.clientY);
    const nextHeight = nextBottom - nextTop;

    return getActiveBlockNextState({
      block,
      nextSize: { height: nextHeight + 'px' },
      nextPosition: { top: nextTop + 'px' },
    });
  };

  const leftLineStrategy = (e: MouseEvent, block: Blocks) => {
    const { nextLeft, nextRight } = getNextFromLeft(e.clientX);
    const nextWidth = nextRight - nextLeft;

    return getActiveBlockNextState({
      block,
      nextSize: { width: nextWidth + 'px' },
      nextPosition: { left: nextLeft + 'px' },
    });
  };

  const lineMouseMoveHandler = (e: MouseEvent) => {
    if (activedBlockGroup?.type !== 'block') return;
    if (!nowUpdate || nowUpdate in EdgeDirectionsConstants || !isUpdating[nowUpdate]) return;

    const getNextState = getNextStateStrategyFactory({
      type: nowUpdate as DirectionsConstants,
    });

    if (getNextState === null) return;

    const nextState = getNextState(e, activedBlockGroup);

    if (activedBlockGroup.subType === 'text') {
      changeBlockState(nextState as TextBlock);
    } else {
      changeBlockState(nextState as NonTextBlock);
    }
  };

  useEffect(() => {
    if (!nowUpdate || !(nowUpdate in DirectionsConstants)) return;
    window.addEventListener('mousemove', lineMouseMoveHandler);

    return () => {
      window.removeEventListener('mousemove', lineMouseMoveHandler);
    };

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [lineMouseMoveHandler]);

  /**
   * INFO: Edge Strategies
   * 각 상/하/좌/우의 라인에서 값을 업데이트하는 것을 담당하는 함수입니다.
   */
  const topLeftEdgeGetNextStyleStrategy = (e: MouseEvent) => {
    const { clientX, clientY } = e;

    return {
      ...getNextFromTop(clientY),
      ...getNextFromLeft(clientX),
    };
  };

  const topRightEdgeGetNextStyleStrategy = (e: MouseEvent) => {
    const { clientX, clientY } = e;

    return {
      ...getNextFromTop(clientY),
      ...getNextFromRight(clientX),
    };
  };

  const bottomRightEdgeGetNextStyleStrategy = (e: MouseEvent) => {
    const { clientX, clientY } = e;

    return {
      ...getNextFromBottom(clientY),
      ...getNextFromRight(clientX),
    };
  };

  const bottomLeftEdgeGetNextStyleStrategy = (e: MouseEvent) => {
    const { clientX, clientY } = e;

    return {
      ...getNextFromBottom(clientY),
      ...getNextFromLeft(clientX),
    };
  };

  const getEdgeNextStyleStrategyFactory = (action: { type: EdgeDirectionsConstants }) => {
    switch (action.type) {
      case EdgeDirectionsConstants.topLeft: {
        return topLeftEdgeGetNextStyleStrategy;
      }
      case EdgeDirectionsConstants.topRight: {
        return topRightEdgeGetNextStyleStrategy;
      }
      case EdgeDirectionsConstants.bottomRight: {
        return bottomRightEdgeGetNextStyleStrategy;
      }
      case EdgeDirectionsConstants.bottomLeft: {
        return bottomLeftEdgeGetNextStyleStrategy;
      }

      default: {
        return null;
      }
    }
  };

  const edgeMouseMoveHandler = (e: MouseEvent) => {
    if (activedBlockGroup?.type !== 'block') return;
    if (!nowUpdate || nowUpdate in DirectionsConstants || !isUpdating[nowUpdate]) return;

    const nowStrategy = getEdgeNextStyleStrategyFactory({
      type: nowUpdate as EdgeDirectionsConstants,
    });

    if (nowStrategy === null) return;

    const { nextLeft, nextRight, nextTop, nextBottom } = nowStrategy(e);

    const nextWidth = nextRight - nextLeft;
    const nextHeight = nextBottom - nextTop;

    const nextState = getActiveBlockNextState({
      block: activedBlockGroup as Blocks,
      nextSize: { width: nextWidth + 'px', height: nextHeight + 'px' },
      nextPosition: { left: nextLeft + 'px', top: nextTop + 'px' },
    });

    if (activedBlockGroup.subType !== 'text') {
      changeBlockState(nextState as TextBlock);
    } else {
      changeBlockState(nextState as NonTextBlock);
    }
  };

  useEffect(() => {
    if (!nowUpdate || !(nowUpdate in EdgeDirectionsConstants)) return;
    window.addEventListener('mousemove', edgeMouseMoveHandler, { passive: true });

    return () => {
      window.removeEventListener('mousemove', edgeMouseMoveHandler);
    };

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [edgeMouseMoveHandler]);

  return (
    <>
      {[
        DirectionsConstants.top,
        DirectionsConstants.right,
        DirectionsConstants.bottom,
        DirectionsConstants.left,
      ].map((direction) => (
        <UpdatorLine
          key={direction}
          direction={direction}
          onMouseDown={(e) => onMouseDown(e, direction)}
          onMouseUp={() => onMouseUp(nowUpdate)}
        />
      ))}

      {[
        EdgeDirectionsConstants.topLeft,
        EdgeDirectionsConstants.topRight,
        EdgeDirectionsConstants.bottomRight,
        EdgeDirectionsConstants.bottomLeft,
      ].map((direction) => (
        <UpdatorEdge
          key={direction}
          direction={direction}
          onMouseDown={(e) => onMouseDown(e, direction)}
          onMouseUp={() => onMouseUp(nowUpdate)}
        />
      ))}
    </>
  );
}
