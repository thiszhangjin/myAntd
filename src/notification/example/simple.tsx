import React from 'react';
import { Button, notification } from 'pq-antd';

function notificationExaple(
  message: string,
  duration: number,
  showBtn?: boolean,
) {
  notification.open({
    message,
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    duration,
    btn: showBtn ? <Button type="primary">ok</Button> : null,
  });
}

export default () => (
  <div>
    <Button type="primary" onClick={() => notificationExaple('自动关闭', 4.5)}>
      自动关闭
    </Button>

    <Button
      type="primary"
      onClick={() => notificationExaple('不会自动关闭', 0)}
    >
      不会自动关闭
    </Button>

    <Button
      type="primary"
      onClick={() => notificationExaple('带有按钮', 4.5, true)}
    >
      带有按钮
    </Button>
  </div>
);
