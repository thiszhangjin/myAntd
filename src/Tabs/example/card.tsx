import React from 'react';
import { Tabs } from 'pq-antd';

const { TabPane } = Tabs;

class App extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Tab 1" key="1" forceRender>
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
          <TabPane tab="Tab 4" key="4" disabled>
            Content of Tab Pane 4
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default () => <App />;
