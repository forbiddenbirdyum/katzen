import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
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
      <button onClick={handleEdit} className={styles.button} type="button" title="Edit message">
        Edit Message
        <MdEdit className={styles.editIcon} />
      </button>
    </div>
    <div className={styles.item}>
      <button onClick={handleDelete} className={styles.button} type="button" title="Delete message">
        Delete Message
        <FaTrashAlt className={styles.deleteIcon} />
      </button>
    </div>
  </div>
));

export default ContextMenu;
