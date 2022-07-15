/*
 * @Author: 王荣
 * @Date: 2022-07-14 14:38:03
 * @LastEditors: 王荣
 * @LastEditTime: 2022-07-14 21:09:46
 * @Description: 填写简介
 */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// tool
import path from 'path';
import fs from 'fs';
// 按需加载antd组件的css样式
// 寻找社区方案 有vite-plugin-imp和vite-plugin-style-import。因为只有样式不会按需导入，只要根据需求导入样式即可
// 并且vite-plugin-style-import更热门些，vite-plugin-imp还有issue未关，目前看似不太完善，缺少维护。
// 但目前2.0版本的vite-plugin-style-import有一个难以置信的错误，这个包使用了consola 但是它的依赖里没有，导致运行一直报错，自己装上，但后续可能换其他库实现这个按需导入功能。
import {
  createStyleImportPlugin,
  AndDesignVueResolve,
  VantResolve,
  ElementPlusResolve,
  NutuiResolve,
  AntdResolve,
} from 'vite-plugin-style-import';
import lessToJS from 'less-vars-to-js'
// 可视化打包结果
import { visualizer } from 'rollup-plugin-visualizer'


// https://vitejs.dev/config/
export default ({ mode }) => {
  // vite的环境变量都在import.meta.env......
  // 可以在根目录新建一个env文件配置 vite规定自定义的环境变量要以VITE_开头 否则因为安全原因会被忽略
  // 但在vite.config.js中无法直接获取 必须借助loadEnv这个api
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  console.log('process:::env', process.env)

  // 从配置的less文件中将less变量key value映射成js对象
  const themeVariables = lessToJS(
    fs.readFileSync(path.resolve(__dirname, './src/config/antd-variables.less'), 'utf8')
  )

  const extraPlugins = [];

  if(process.env.VITE_ANALYZE === 'true'){
    extraPlugins.push(
      // 打包可视化分析
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    )
  }

  return defineConfig({
    build: {
      // ... other options
  
      // 自定义terserOptions必须指定minify为'terser' 否则会报以下warning
      // 指定terser必须安装下terser vite2开始不内置这个插件了
      // WARN  build.terserOptions is specified but build.minify is not set to use Terser. Note Vite now defaults to use esbuild for minification. If you still prefer Terser, set build.minify to "terser".
      minify: 'terser',
      terserOptions: {
        // 主要移除代码中的console和debug 和webpack中的webpackConfig.optimization.minimizer 里的TerserPlugin一样
        compress: {
          drop_console: true, // discard calls to console.* functions
          drop_debugger: true, // remove debugger; statements
        },
      },
    },
    resolve: {
      // 路径别名
      // 单这里配置还不完整，还需要配置 tsconfig.json 文件：在 compilerOptions 里面添加 "baseUrl": "./" 和 "paths": { "@/*": ["src/*"] }
      // alias: [
      //   {
      //     find: '@',
      //     replacement: path.resolve(process.cwd(), '/src'),
      //   },
      // ],
      alias: {
        '~': path.resolve(__dirname, './'), // 根路径
        '@': path.resolve(__dirname, 'src') // src 路径
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
          // css预处理 这里修改antd的默认变量属性
          modifyVars: themeVariables,
        },
      },
    },
  
    plugins: [
      ...extraPlugins,
      react(),
      // antd样式按需导入
      createStyleImportPlugin({
        resolves: [
          // AndDesignVueResolve(),
          // VantResolve(),
          // ElementPlusResolve(),
          // NutuiResolve(),
          AntdResolve(),
        ],
        libs: [
          {
            libraryName: 'antd',
            esModule: true,
            resolveStyle: (name) => {
              return `antd/es/${name}/style/index`;
            },
          },
        ]
      }),
  
    ]
  })

}



