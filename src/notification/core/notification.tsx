import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Notice, { NoticeProps } from './notice';
import Animate from 'rc-animate';

export interface NotificationProps {
  prefixCls: string;
  style?: React.CSSProperties;
  placement?: placementType;
}

export type placementType =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

interface noticeDataProps extends NoticeProps {
  key: number | string;
  content: string | ReactNode;
}

interface IState {
  NoticeList: noticeDataProps[];
}

let count: number = 0;
function getKey(): string {
  count++;
  return new Date().getTime() + '' + count;
}

export default class Notification extends React.Component<
  NotificationProps,
  IState
> {
  static newInstance: any;
  public readonly state: Readonly<IState> = {
    NoticeList: [],
  };

  public constructor(props: NotificationProps) {
    super(props);
  }

  static defaultProps = {
    prefixCls: 'pq-antd',
    style: {
      position: 'fixed',
      zIndex: 1000,
    },
  };

  add = (noticeData: noticeDataProps) => {
    const { key } = noticeData;
    const { NoticeList } = this.state;
    noticeData.key = key || getKey();

    const filterIndex = NoticeList.map(item => item.key).indexOf(key);
    if (filterIndex > -1) {
      noticeData.update = true;
      NoticeList[filterIndex] = noticeData;
    } else {
      NoticeList.push(noticeData);
    }

    this.setState({
      NoticeList: [...NoticeList],
    });
  };

  delete = (key: number | string) => {
    const { NoticeList } = this.state;
    this.setState({
      NoticeList: NoticeList.filter(item => item.key !== key),
    });
  };

  render(): React.ReactNode {
    const { prefixCls, placement, style } = this.props;
    const { NoticeList } = this.state;
    const classes = classNames(`${prefixCls}-notification`, {
      [`${prefixCls}-notification-${placement}`]: placement,
    });
    let renderNode = NoticeList.map(item => {
      const { key, content, onClose, ...others } = item;
      const noticeProps: NoticeProps = {
        prefixCls,
        onClose: () => {
          this.delete(key);
          if (onClose) {
            onClose();
          }
        },
        children: content,
        ...others,
      };
      return <Notice {...noticeProps} key={item.key} />;
    });
    return (
      <div className={classes} style={style}>
        <Animate transitionName={`${prefixCls}-fade`}>{renderNode}</Animate>
      </div>
    );
  }
}

Notification.newInstance = function(
  newInstanceFun: (Notification: Notification) => {},
  NotificationProps: NotificationProps,
) {
  const node: Element = document.createElement('div');
  node.className = `${NotificationProps.prefixCls}`;
  document.body.appendChild(node);

  function ref(Notification: Notification) {
    newInstanceFun(Notification);
  }

  ReactDOM.render(<Notification ref={ref} {...NotificationProps} />, node);
};
