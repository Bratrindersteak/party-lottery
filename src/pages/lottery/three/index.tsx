import { useThree } from './useThree.tsx';

import styles from './styles.module.css';

function Three() {
  const { containerRef } = useThree();

  return (
    <div className={styles.container} ref={containerRef}></div>
  );
}

export default Three;
