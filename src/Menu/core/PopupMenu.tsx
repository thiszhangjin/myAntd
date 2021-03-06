import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import CSSMotion from 'rc-animate/lib/CSSMotion';
import { MenuMode } from './Menu';

export interface PopupMenuProps {
  prefixCls?: string;
  className?: string;
  visible?: boolean;
  parentNode?: React.RefObject<any>;
  mode?: MenuMode;
  level?: number;
  children?: React.ReactNode;
}
interface PopupMenuState {
  menuStyle: React.CSSProperties;
}

interface ParentElementClientRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default class PopupMenu extends React.Component<
  PopupMenuProps,
  PopupMenuState
> {
  public readonly state: Readonly<PopupMenuState> = {
    menuStyle: {
      visibility: 'hidden',
    },
  };

  parentElement: HTMLDivElement | null | undefined;

  parentElementClientRect: ParentElementClientRect = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };

  targetElement: Element | null = null;

  menuRef = React.createRef<HTMLUListElement>();

  placementClassName: string = '';

  static defaultProps = {
    prefixCls: 'pq-antd-menu',
    visible: false,
  };

  componentDidMount() {
    this.getBoundingClientRect();
    this.getStyle();
  }

  getSnapshotBeforeUpdate(prevProps: PopupMenuProps): boolean {
    if (prevProps.visible !== this.props.visible) {
      return true;
    }
    return false;
  }

  componentDidUpdate(
    prevProps: PopupMenuProps,
    prevState: PopupMenuState,
    snapshot: boolean,
  ) {
    if (snapshot) {
      this.getBoundingClientRect();
      this.getStyle();
    }
  }

  getBoundingClientRect = () => {
    const { parentNode } = this.props;
    this.parentElement = parentNode?.current;
    if (this.parentElement) {
      const {
        top,
        left,
        width,
        height,
      } = this.parentElement.getBoundingClientRect();
      this.parentElementClientRect = {
        top,
        left,
        width,
        height,
      };
    }
  };

  getCoordinate = (): { top: number; left: number } => {
    const { mode } = this.props;
    const { top, left, width, height } = this.parentElementClientRect;
    const menuWidth = this.getMenuStyle().width;
    const popupMenuSpacing = 5;
    if (mode === 'horizontal') {
      if (left + menuWidth <= window.innerWidth) {
        this.placementClassName = 'bottom-left';
        return {
          left,
          top: top + height + popupMenuSpacing,
        };
      }
      this.placementClassName = 'bottom-right';
      return {
        left: left + width - menuWidth,
        top: top + height + popupMenuSpacing,
      };
    }

    if (mode === 'vertical') {
      if (width + left + menuWidth <= window.innerWidth) {
        this.placementClassName = 'right-top';
        return {
          left: left + width + popupMenuSpacing,
          top,
        };
      }
      this.placementClassName = 'left-top';
      return {
        left: left - menuWidth - popupMenuSpacing,
        top,
      };
    }

    return {
      left: left + width + popupMenuSpacing,
      top,
    };
  };

  getMenuStyle = (): { width: number; height: number } => {
    if (!this.menuRef.current!) {
      return {
        width: 0,
        height: 0,
      };
    }

    const { width, height } = this.menuRef.current!.getBoundingClientRect();
    return {
      width,
      height,
    };
  };

  getStyle = () => {
    const { top, left } = this.getCoordinate();
    const { visible, mode, level = 0 } = this.props;
    const { width } = this.parentElementClientRect;
    const targetStyle: React.CSSProperties = {
      visibility: visible ? 'visible' : 'hidden',
    };
    if (visible) {
      targetStyle.top = top;
      targetStyle.left = left;
      targetStyle.zIndex = 1050 + level;
    }
    if (mode === 'horizontal') {
      targetStyle.minWidth = `${width}px`;
    }

    this.setState({
      menuStyle: targetStyle,
    });
  };

  getClasses = (): string => {
    const { prefixCls } = this.props;
    return classNames(prefixCls, `${prefixCls}-sub`, {
      [`${prefixCls}-vertical`]: true,
      [`${prefixCls}-placement-${this.placementClassName}`]: this
        .placementClassName,
    });
  };

  renderMenu = () => {
    const { children, prefixCls, visible } = this.props;
    const { menuStyle } = this.state;

    const classes = this.getClasses();

    return (
      <CSSMotion
        visible={visible}
        motionName={`${prefixCls}-zoom`}
        leavedClassName={`${prefixCls}-hidden`}
        removeOnLeave={false}
      >
        {({ style, className }) => (
          <ul
            className={classNames(classes, className)}
            style={{ ...menuStyle, ...style }}
            ref={this.menuRef}
          >
            {children}
          </ul>
        )}
      </CSSMotion>
    );
  };

  createContainer = (): Element => {
    let containerNode = document.getElementById('triggerContainer');
    if (!containerNode) {
      containerNode = document.createElement('div');
      containerNode.id = 'triggerContainer';
      document.body.appendChild(containerNode);
    }
    return containerNode;
  };

  render() {
    if (!this.targetElement) {
      this.targetElement = this.createContainer();
    }
    return ReactDOM.createPortal(this.renderMenu(), this.targetElement);
  }
}
