import { useState } from 'react';

/**
 * make UI refresh immediately
 * @returns () => void
 * usage:
 * const { forceUpdate } = useForceUpdate();
 * forceUpdate();
 */
const useForceUpdate = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, update] = useState(0);

  return {
    forceUpdate: () => {
      update((up) => up + 1);
    },
  };
};

export { useForceUpdate };
