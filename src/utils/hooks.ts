import { useState } from 'react';

/**
 * make UI refresh immediately
 * @returns () => void
 * usage:
 * const { forceUpdate } = useForceUpdate();
 * forceUpdate();
 */
const useForceUpdate = () => {
  const [force, update] = useState(0);

  return {
    force,
    forceUpdate: () => {
      update((up) => up + 1);
    },
  };
};

export { useForceUpdate };
