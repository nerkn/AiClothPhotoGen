import React from 'react';
import { Route, Switch } from 'wouter';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PhotoGenPage from './pages/PhotoGenPage';
import VideoGenPage from './pages/VideoGenPage';
import StoryGenPage from './pages/StoryGenPage';
import ExporterPage from './pages/ExporterPage';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/photo-gen/:id" component={PhotoGenPage} />
        <Route path="/video-gen/:id" component={VideoGenPage} />
        <Route path="/story-gen/:id" component={StoryGenPage} />
        <Route path="/exporter/:id" component={ExporterPage} />
      </Switch>
    </Layout>
  );
}

export default App;