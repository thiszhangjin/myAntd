import React from 'react';
import classNames from 'classnames';
import { connect } from 'mini-store';

export interface MenuItemProps {
  prefixCls?: string;
  className?: string;
  disabled?: boolean;
  eventKey?: string;
  title?: string;
  selectedKeys?: string[];
  activeKeys?: string[];
  openKeys?: string[];
  style?: React.CSSProperties;
  onClick?: (key: string) => void;
  updateActiveKeys?: (key: string, active: boolean) => void;
  updateOpenKeys?: (key: string, active: boolean) => void;
}
interface MenuItemState {}
@connect(state => ({
  selectedKeys: state.selectedKeys,
  activeKeys: state.activeKeys,
  openKeys: state.openKeys,
  onClick: state.onClick,
  updateActiveKeys: state.updateActiveKeys,
  updateOpenKeys: state.updateOpenKeys,
}))
export default class extends React.Component<MenuItemProps, MenuItemState> {
  public readonly state: Readonly<MenuItemState> = {};

  static defaultProps = {
    prefixCls: 'pq-antd-menu',
  };

  onMouseAction = (active: boolean) => {
    const { eventKey } = this.props;
    if (this.props.updateActiveKeys && eventKey) {
      this.props.updateActiveKeys(eventKey, active);
    }
  };

  onClick = (event: React.MouseEvent) => {
    const { eventKey } = this.props;
    event.stopPropagation();
    if (this.props.onClick && eventKey) {
      this.props.onClick(eventKey);
    }
  };

  getMenuEvents = () => {
    const { disabled } = this.props;
    if (disabled) {
      return {};
    }
    return {
      onMouseEnter: () => this.onMouseAction(true),
      onMouseLeave: () => this.onMouseAction(false),
      onClick: (event: React.MouseEvent) => this.onClick(event),
    };
  };

  render() {
    const {
      prefixCls,
      className,
      children,
      disabled,
      selectedKeys,
      eventKey,
      activeKeys,
      style,
    } = this.props;
    const classes = classNames(className, `${prefixCls}-item`, {
      [`${prefixCls}-item-active`]:
        eventKey && activeKeys && activeKeys.includes(eventKey),
      [`${prefixCls}-item-selected`]:
        eventKey && selectedKeys && selectedKeys.includes(eventKey),
      [`${prefixCls}-item-disabled`]: disabled,
    });
    const menuEvents = this.getMenuEvents();
    return (
      <li className={classes} style={style} {...menuEvents}>
        {children}
      </li>
    );
  }
}
