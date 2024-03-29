import { useAtom } from 'jotai';

import { initialBlockCreationState, templateCreateToolbarAtom } from '@atoms/index';

export const useTemplateCreateToolbar = () => {
  const [toolbarState, setToolbarState] = useAtom(templateCreateToolbarAtom);

  const setShapeBlockCreationActive = () => {
    setToolbarState((state) => ({
      ...state,
      blockCreation: {
        ...state.blockCreation,
        type: 'block',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      },
    }));
  };

  const enableCreating = () => {
    setToolbarState((state) => ({
      ...state,
      isCreating: true,
    }));
  };

  const disableCreating = () => {
    setToolbarState((state) => ({
      ...state,
      isCreating: false,
    }));
  };

  const setBlockCreationWidth = (width: number) => {
    setToolbarState((state) => ({
      ...state,
      blockCreation: {
        ...state.blockCreation,
        width,
      },
    }));
  };

  const setBlockCreationHeight = (height: number) => {
    setToolbarState((state) => ({
      ...state,
      blockCreation: {
        ...state.blockCreation,
        height,
      },
    }));
  };

  const setBlockCreationTop = (top: number) => {
    setToolbarState((state) => ({
      ...state,
      blockCreation: {
        ...state.blockCreation,
        top,
      },
    }));
  };

  const setBlockCreationLeft = (left: number) => {
    setToolbarState((state) => ({
      ...state,
      blockCreation: {
        ...state.blockCreation,
        left,
      },
    }));
  };

  const setTextBlockCreationActive = () => {
    setToolbarState((state) => ({
      ...state,
      blockCreation: {
        ...state.blockCreation,
        type: 'text',
        width: 0,
        height: 0,
      },
    }));
  };

  const initializeBlockCreation = () => {
    setToolbarState((state) => ({
      ...state,
      blockCreation: { ...initialBlockCreationState },
    }));
  };

  return {
    isCreating: toolbarState.isCreating,
    blockCreationState: toolbarState.blockCreation,
    enableCreating,
    disableCreating,
    setShapeBlockCreationActive,
    setTextBlockCreationActive,
    setBlockCreationWidth,
    setBlockCreationHeight,
    setBlockCreationTop,
    setBlockCreationLeft,
    initializeBlockCreation,
  };
};
