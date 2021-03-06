import React from 'react';
import classNames from 'classnames';

export interface TabNodeProps {
  prefixCls?: string;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  active?: boolean;
  tabKey?: string;
  disabled?: boolean;
  nodeWrapper?: (node: any) => React.ReactElement;

  onClick?: (
    activeKey: string,
    e: React.KeyboardEvent | React.MouseEvent,
  ) => void;
}

function TabNode(
  {
    prefixCls,
    id,
    className,
    style,
    active,
    tabKey,
    disabled,
    nodeWrapper,
    children,
    onClick,
  }: TabNodeProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const classes = classNames(
    `${prefixCls}-node`,
    {
      [`${prefixCls}-node-active`]: active,
      [`${prefixCls}-node-disabled`]: disabled,
    },
    className,
  );

  let node = (
    <div
      id={id && `${id}-tabNode-${tabKey}`}
      className={classes}
      style={style}
      onClick={e => !disabled && onClick?.(tabKey || '', e)}
      ref={ref}
    >
      {children}
    </div>
  );

  if (nodeWrapper) {
    node = nodeWrapper(node);
  }

  return node;
}

export default React.forwardRef(TabNode);
