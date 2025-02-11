import React, { useState } from "react"
import { Router, Link, Match } from "@reach/router"
import Helmet from "react-helmet"
import Logo from "../assets/images/logo.svg"
import Github from "../assets/images/github.svg"
import Twitter from "../assets/images/twitter.svg"
import Discord from "../assets/images/discord.svg"
import { Close, Menu } from "../components/icons"
import { ThemeProvider } from "../contexts/theme"
import { RouterProvider } from "../contexts/router"
import { useRouter } from "../hooks/use-router"
import { useTheme } from "../hooks/use-theme"

// Glob import all components in the route directory
const routeComponentsMap = {}
function importAll(r) {
  r.keys().forEach(key => {
    let keyWithoutExtension = key.substr(0, key.lastIndexOf(".")) || key

    routeComponentsMap[keyWithoutExtension] = r(key)
  })
}
importAll(require.context("./", true, /\.(js|jsx|mdx|tx|tsx)$/))

const themeClasses = {
  light: {
    active: "text-gray-900",
    inactive: "text-gray-600 hover:text-gray-900",
  },
  dark: {
    active: "text-gray-100",
    inactive: "text-gray-500 hover:text-gray-100",
  },
}

export default function(props) {
  return (
    <RouterProvider {...props}>
      <ThemeProvider {...props}>
        <AppInner {...props} />
      </ThemeProvider>
    </RouterProvider>
  )
}

function AppInner(props) {
  let { theme } = useTheme()
  let router = useRouter()
  // activePage is not set for /api routes, once we fix this we should be able
  // to remove this conditional logic.
  let showHeaderNav = true // default
  if (router.activePage && router.activePage.meta.showHeaderNav !== undefined) {
    showHeaderNav = router.activePage.meta.showHeaderNav
  }

  return (
    <>
      <Helmet>
        <html className={`${theme === "dark" ? "bg-gray-1000" : "bg-white"}`} />
      </Helmet>

      <div className="antialiased text-gray-700 font-body font-light leading-normal min-h-screen flex flex-col">
        <Header showHeaderNav={showHeaderNav} />

        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </>
  )
}

function Header({ showHeaderNav }) {
  const { theme } = useTheme()
  let [isShowingMobileNav, setIsShowingMobileNav] = useState(false)

  return (
    <div
      className={`relative z-50 ${
        theme === "dark" ? "bg-gray-1000" : "bg-white shadow"
      }`}
    >
      <div className="mx-auto max-w-8xl md:px-8">
        <header
          className={`lg:py-2
            ${isShowingMobileNav && theme === "dark" ? "bg-gray-900" : ""}
          `}
        >
          <div className="flex items-center">
            <Link
              to="/"
              className={`px-5 py-2 md:px-0 flex items-center flex-shrink-0  ${
                // theme === "dark" ? "text-green-500" : "text-gray-900"
                theme === "dark" ? "text-green-500" : "text-green-500"
              }`}
              onClick={() => setIsShowingMobileNav(false)}
            >
              <Logo
                className={`
                ${
                  theme === "dark"
                    ? "w-24 md:w-28 lg:w-34 py-3 text-gray-100"
                    : "w-24 md:w-28 py-2 lg:py-1 text-gray-900"
                }
              `}
              />
            </Link>

            {/* Leaving out for now, but want to make this work. Just need to figure out a treatment for homepage. */}
            {/* <span
              style={{ marginLeft: "125px", marginRight: "50px" }}
              className={`hidden lg:block py-4 border-l ${
                theme === "dark"
                  ? "border-gray-700"
                  : "lg:block border-gray-200"
              }`}
            ></span> */}

            {/* Mobile nav button */}
            {showHeaderNav ? (
              <div className="ml-auto md:hidden">
                <button
                  onClick={() => setIsShowingMobileNav(!isShowingMobileNav)}
                  className={`flex px-5 py-3 2xl:py-2 items-center focus:outline-none ${
                    themeClasses[theme]["inactive"]
                  } lg:hidden `}
                >
                  {isShowingMobileNav ? (
                    <Close className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </button>
              </div>
            ) : null}

            {/* Desktop nav */}
            <div className="hidden md:flex md:items-center md:ml-8 lg:ml-12">
              {showHeaderNav ? (
                <>
                  <NavLink
                    to="/docs/getting-started/introduction"
                    activeFor="/docs/*"
                  >
                    Guides
                  </NavLink>
                  <NavLink to="/api/classes/association" activeFor="/api/*">
                    API
                  </NavLink>
                  <NavLink to="/examples/react/simple-example" activeFor="/examples/*">
                    Examples
                  </NavLink>
                </>
              ) : null}
            </div>

            <div className="hidden md:flex md:items-center md:ml-auto md:flex md:items-center">
              <a
                href="https://discord.gg/pPsdsrn"
                className={`px-1 mr-5 ${themeClasses[theme]["inactive"]}`}
              >
                <Discord className="fill-current h-5" />
              </a>
              <a
                href="https://twitter.com/miragejs"
                className={`px-1 mr-5 ${themeClasses[theme]["inactive"]}`}
              >
                <Twitter className="fill-current h-5" />
              </a>
              <a
                href="https://github.com/miragejs/server"
                className={`px-1 ${themeClasses[theme]["inactive"]}`}
              >
                <Github className="fill-current h-5" />
              </a>
            </div>
          </div>

          {/* Mobile nav */}
          {isShowingMobileNav && (
            <nav className="font-medium text-lg md:hidden">
              <div
                className={`border-t ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <MobileNavLink
                  to="/docs/getting-started/introduction"
                  onClick={() => setIsShowingMobileNav(false)}
                >
                  Guides
                </MobileNavLink>
              </div>

              <div
                className={`border-t ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <MobileNavLink
                  to="/api/classes/association"
                  onClick={() => setIsShowingMobileNav(false)}
                >
                  API
                </MobileNavLink>
              </div>

              <div
                className={`border-t ${
                  theme === "dark" ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <MobileNavLink
                  to="https://github.com/miragejs/server"
                  onClick={() => setIsShowingMobileNav(false)}
                >
                  GitHub
                </MobileNavLink>
              </div>
            </nav>
          )}
        </header>
      </div>
    </div>
  )
}

function MobileNavLink(props) {
  const { theme } = useTheme()
  const baseClasses = `block px-5 py-4`
  const isExternal = props.to.indexOf("http") === 0
  const linkClasses = {
    light: {
      active: "text-gray-900",
      inactive: "text-gray-600 hover:text-gray-900",
    },
    dark: {
      active: "text-gray-100",
      inactive: "text-gray-100 hover:text-gray-100",
    },
  }

  let link

  if (isExternal) {
    link = (
      <a
        href={props.to}
        {...props}
        className={`${baseClasses} ${linkClasses[theme]["inactive"]}`}
      >
        {props.children}
      </a>
    )
  } else {
    const isPartiallyActive = ({ isPartiallyCurrent }) => {
      let state = isPartiallyCurrent ? "active" : "inactive"

      return {
        className: `${baseClasses} ${linkClasses[theme][state]}`,
      }
    }

    link = <Link {...props} getProps={isPartiallyActive} />
  }

  return link
}

function NavLink({ activeFor, ...props }) {
  const { theme } = useTheme()

  activeFor = activeFor || props.to

  return (
    <Match path={activeFor}>
      {({ match }) => {
        let state = match ? "active" : "inactive"

        return (
          <Link
            {...props}
            className={`mr-5 lg:mr-7 px-1 font-medium ${themeClasses[theme][state]}`}
          />
        )
      }}
    </Match>
  )
}

let memoizedOutlet

function renderRoutes(routes) {
  return routes.map(route => {
    let explicitComponent =
      routeComponentsMap[`./${route.fullName.replace(/\./g, "/")}`]
    let EmptyComponent = props => props.children
    let Component = explicitComponent
      ? explicitComponent.default
      : EmptyComponent

    return (
      <Component path={route.path} key={route.fullName}>
        {renderRoutes(route.routes)}
      </Component>
    )
  })
}

function Outlet() {
  let router = useRouter()

  if (!memoizedOutlet) {
    memoizedOutlet = renderRoutes(router.routes)
  }

  return <Router primary={false}>{memoizedOutlet}</Router>
}
