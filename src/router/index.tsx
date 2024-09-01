import { getBrowserLang, i18n_langs } from "i18n/config";
import { getStorageLng, setStorageLng } from "i18n/storage";
import React, { Suspense, lazy, ReactElement, ReactNode, ComponentType, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useRoutes,
  Navigate,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import ContentWrapper from "./ContentWrapper";
import { DeployerPage, Jetton } from "pages";
import { ROUTES } from "consts";
import { arrayObjectToflat } from "utils/methods";

function withLanguageGuard(Component: ComponentType): ComponentType {
  return function LanguageGuard(): ReactElement {
    const { lang } = useParams<{ lang: string }>();
    const location = useLocation();
    const { i18n } = useTranslation();

    useEffect(() => {
      // 只有当 lang 改变时才调用 changeLanguage 并更新缓存
      const normalizedLang = lang?.toLowerCase();
      if (i18n_langs.includes(normalizedLang || "")) {
        i18n.changeLanguage(normalizedLang);
        setStorageLng(normalizedLang); // 更新本地存储中的语言
      }
    }, [lang, i18n]);

    if (!i18n_langs.includes(lang?.toLowerCase() || "")) {
      const newPath = "/en-us" + location.pathname + location.search;
      return <Navigate to={newPath} replace />;
    }

    return <Component />;
  };
}

const GuardedMainLayout = withLanguageGuard(ContentWrapper);

const RedirectToDefaultLang = () => {
  const location = useLocation();
  const defaultLang = "/en-us";

  // 获取本地存储中的语言
  let storedLang = getStorageLng();

  // 如果本地存储中没有语言，则使用浏览器语言并转换为小写
  if (!storedLang) {
    const browserLang = getBrowserLang();
    storedLang = i18n_langs.includes(browserLang) ? browserLang : "en-us";
    setStorageLng(storedLang); // 更新本地存储
  }

  const redirectPath = `/${storedLang}`;

  if (location.pathname === "/") {
    return <Navigate to={redirectPath} replace />;
  }

  return null;
};

function toRouteInfo(list: any, prexPath: string = "") {
  return list.map((item: any) => {
    let { path, label } = item;
    let children = [];
    let allPath =
      path !== undefined
        ? prexPath === ""
          ? path
          : prexPath + (prexPath === "/" ? "" : "/") + path
        : prexPath;
    // let allPath = item.path
    if (item.children?.length > 0) {
      children = toRouteInfo(item.children, allPath);
    }
    return {
      path: allPath,
      label,
      children,
    };
  });
}

const RouteChildren: any = [
  { index: true, label: "nav.home", element: <DeployerPage /> },
  { path: ROUTES.deployer, label: "nav.token", element: <DeployerPage /> },
  { path: ROUTES.jettonId, label: "nav.token", element: <Jetton /> },
  { path: "*", element: <Navigate to={`/`} /> },
];

const MyRoutes: any = [
  // {
  //   path: '/',
  //   label: 'nav.home',
  //   element: <MainLayout />,
  //   children: RouteChildren
  // },
  {
    path: "/",
    label: "nav.home",
    element: <RedirectToDefaultLang />,
  },
  {
    path: "/:lang",
    label: "nav.home",
    element: <GuardedMainLayout />,
    children: RouteChildren,
  },
];

export const routeInfo = arrayObjectToflat(toRouteInfo(MyRoutes), "children");
const RouterView = (): ReactElement => {
  const element = useRoutes(MyRoutes);
  return <div>{element}</div>;
};

export default RouterView;
