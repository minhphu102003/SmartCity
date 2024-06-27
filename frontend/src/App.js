import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { router } from './routes';
import { Layout } from './layouts/index.js';
import { Fragment } from 'react';

function App() {
  return (
    <Routes>
      {router.map((route, index) => {
        const Page = route.component;

        let LayoutDynamic = Layout;
        if (route.layout) LayoutDynamic = route.layout;
        else if (route.layout === null) LayoutDynamic = Fragment;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <LayoutDynamic>
                <Page />
              </LayoutDynamic>
            }
          />
        );
      })}
    </Routes>
  );
}

export default App;