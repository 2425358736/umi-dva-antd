import router from 'umi/router';
import styles from './users.css';
import { Button } from 'antd'

export default function () {
  return (
    <>
      <div className={styles.normal}>
        <h1>Page users</h1>
      </div>

      <Button> 按钮 </Button>

      <button onClick={() => {
        router.goBack();
      }}>go back</button>
    </>
  );
}
