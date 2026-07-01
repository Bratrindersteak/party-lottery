import { useThreeD } from './useThreeD.tsx';

import styles from './styles.module.css';

function ThreeD() {
  const { containerRef } = useThreeD();

  return (
    <div className={styles.container} ref={containerRef}></div>
  );
}

export default ThreeD;
