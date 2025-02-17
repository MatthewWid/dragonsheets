/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as ProductsProductIdImport } from './routes/products.$productId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ProductsProductIdRoute = ProductsProductIdImport.update({
  id: '/products/$productId',
  path: '/products/$productId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/products/$productId': {
      id: '/products/$productId'
      path: '/products/$productId'
      fullPath: '/products/$productId'
      preLoaderRoute: typeof ProductsProductIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/products/$productId': typeof ProductsProductIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/products/$productId': typeof ProductsProductIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/products/$productId': typeof ProductsProductIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/products/$productId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/products/$productId'
  id: '__root__' | '/' | '/products/$productId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ProductsProductIdRoute: typeof ProductsProductIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ProductsProductIdRoute: ProductsProductIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/products/$productId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/products/$productId": {
      "filePath": "products.$productId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
