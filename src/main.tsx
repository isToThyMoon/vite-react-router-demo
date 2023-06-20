/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-06-20 21:19:59
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-06-21 00:26:45
 * @FilePath: /vite-react-router-demo/src/main.tsx
 * @Description: 
 */
import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements,  RouterProvider, Route } from 'react-router-dom';
import Index from './routes';
import Root,{ loader as rootLoader, action as rootAction } from './routes/root';
import ErrorPage from './error-page';
import Contact, { loader as contactLoader,action as contactAction, } from './routes/contact';
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    // Each route can define a "loader" function to provide data to the route element before it renders
    // 用loader来loading data，这里的loader是一个async function，
    // 还有一个api：useLoaderData用于在element的组件中使用，这里的loader返回的数据会被传递给useLoaderData
    loader: rootLoader, 
    // 需要Root组件中添加react-router-dom提供的<Form>组件包裹submit行为按钮，否则会直接发送请求到服务器，而不是发送到路由action中
    //  <Form> prevents the browser from sending the request to the server and sends it to your route action instead. 
    action: rootAction,
    // 通过Root组件中的Outlet组件来渲染子路由
    // 一般通过Link标签来跳转到子路由，这里的Link标签是react-router-dom提供的
    // Link可以实现不同于a标签的无刷新路由跳转，它的实现原理是阻止了a标签的默认事件，并且通过history.pushState()来实现的
    children: [
      // 默认路由
    {
      index: true,
      element: <Index />,
    },{
      path: '/contacts/:contactId',
      element: <Contact />,
      loader: contactLoader,
      action: contactAction,
      errorElement: <div>Oops! There was an error.</div>,
    },{
      path: "contacts/:contactId/edit",
      element: <EditContact />,
      loader: contactLoader,
      action: editAction,
    },{
      path: "contacts/:contactId/destroy",
      action: destroyAction,
      errorElement: <div>Oops! There was an error.</div>,
    },

    ],

    // 除了给单独的errorElement设置错误页面，还可以给整个访问不到的路由设置错误页面
    // Wrap the child routes in a pathless route
    // children: [
    //   {
    //     errorElement: <ErrorPage />,
    //     children: [
    //       { index: true, element: <Index /> },
    //       {
    //         path: "contacts/:contactId",
    //         element: <Contact />,
    //         loader: contactLoader,
    //         action: contactAction,
    //       },
    //       /* the rest of the routes */
    //     ],
    //   },
    // ],
  },
])

// 可选的jsx式路由，和object式没有本质区别
const routers = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<Root />}
      loader={rootLoader}
      action={rootAction}
      errorElement={<ErrorPage />}
    >
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Index />} />
        <Route
          path="contacts/:contactId"
          element={<Contact />}
          loader={contactLoader}
          action={contactAction}
        />
        <Route
          path="contacts/:contactId/edit"
          element={<EditContact />}
          loader={contactLoader}
          action={editAction}
        />
        <Route
          path="contacts/:contactId/destroy"
          action={destroyAction}
        />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
