import React from 'react';
import styles from './ContextMenu.module.scss';

const ContextMenu = React.forwardRef(({
  x, y, handleEdit, handleDelete,
}, ref) => (
  <div
    ref={ref}
    style={{
      top: `${y}px`,
      left: `${x}px`,
    }}
    className={styles['context-menu']}
  >
    <div className={styles.item}>
      <button onClick={handleEdit} className={styles.button} type="button">
        Edit Message
      </button>
    </div>
    <div className={styles.item}>
      <button onClick={handleDelete} className={styles.button} type="button">
        Delete Message
      </button>
    </div>
  </div>
));

export default ContextMenu;
