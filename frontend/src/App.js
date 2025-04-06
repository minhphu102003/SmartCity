import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { router } from './routes';
import { Layout } from './layouts/index.js';
import { Fragment } from 'react';
import { RequiredAdmin } from './pages';

function App() {
  return (
    <Routes>
      {router.map((route, index) => {
        const Page = route.component;

        let LayoutDynamic = Layout;
        if (route.layout) LayoutDynamic = route.layout;
        else if (route.layout === null) LayoutDynamic = Fragment;

        const isAdminRoute = route.requireAdmin === true;

        const element = (
          <LayoutDynamic>
            <Page />
          </LayoutDynamic>
        );

        return (
          <Route
            key={index}
            path={route.path}
            element={
              isAdminRoute ? <RequiredAdmin>{element}</RequiredAdmin> : element
            }
          />
        );
      })}
    </Routes>
  );
}
export default App;