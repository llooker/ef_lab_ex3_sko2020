/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { Sidebar } from "./components/Sidebar"
import { SalesByDay } from "./components/SalesByDay"
import { RevenueByDay } from "./components/RevenueByDay"
import React, { useState } from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import { theme, Box, GlobalStyle } from "@looker/components"
import styled, { ThemeProvider } from "styled-components"
import { ExtensionProvider } from "@looker/extension-sdk-react"

interface AppProps {
  standalone?: boolean
}

export enum ROUTES {
  REVENUE = "/revenue",
  SALES = "/sales",
}

export const App: React.FC<AppProps> = ({ standalone }) => {
  const [pathname, setPathname] = useState("")

  return (
    <ExtensionProvider onPathnameChange={setPathname}>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <Layout>
            <Sidebar pathname={pathname} />
            <Box>
              <Switch>
                <Route path={ROUTES.REVENUE}>
                  <RevenueByDay />
                </Route>
                <Route path={ROUTES.SALES}>
                  <SalesByDay />
                </Route>
                <Redirect to={ROUTES.SALES} />
              </Switch>
            </Box>
          </Layout>
        </>
      </ThemeProvider>
    </ExtensionProvider>
  )
}

export const Layout = styled(Box)`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 200px auto;
`
