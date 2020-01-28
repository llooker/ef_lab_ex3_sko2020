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
// The wrapper exports only a default component class that at the same time is a
// namespace for the related Props interface (HighchartsReact.Props). All other
// interfaces like Options come from the Highcharts module itself.

// React supports function components as a simple way to write components that
// only contain a render method without any state (the App component in this
// example).

import React, { useContext, useEffect } from "react"
import { Heading, Box, Badge, Menu, Button, MenuDisclosure, MenuList, MenuItem } from "@looker/components"
import styled from "styled-components"
import { ExtensionButton } from "../ExtensionButton"

import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import {
  ExtensionContext,
  ExtensionContextData,
  getCoreSDK
} from "@looker/extension-sdk-react"


export const SalesByDay =  () => {
  const [messages, setMessages] = React.useState("")
  const [data, setData] = React.useState([])
  const [cool, setCool] = React.useState([])
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK

  useEffect(() => {
    parent()
  },[]);

  const parent = async () => {

    const myInlineApiCall = (model: string, explore: string, fields: string[], sorts: string[], limit: string, filters: {}) => {
      return new Promise ( (resolve, reject) => {
        // alternate mechanism to get sdk.
        getCoreSDK()
          .run_inline_query({
            result_format: "json_detail",
            limit: limit,
            body: {
              total: true,
              model: model,
              view: explore,
              fields: fields,
              filters: filters,
              sorts: sorts
            }
          })
          .then((response) => {
            if (response.ok) {
              // const x = response.value.data.map(row => {return row['order_items.created_date'].value})
              // const y = response.value.data.map(row => {return row['order_items.count'].value})
              resolve(response.value)
            } else {
              console.log('Network error with API call')
            }
          })
          .catch(error => console.log('Code error'))   
      })
     
    }
  
    const data1 = await myInlineApiCall(
                      "thelook", 
                      "order_items", 
                      ["order_items.created_date","order_items.count"], 
                      ["order_items.created_date desc"],
                      "35",
                      {"category.name":"socks"}
                     )
    setCool(data1)

  }
console.log(cool.data)
let data2 = (cool && cool.data) ? cool.data: []
// console.log(cool.data.map(row => {return row['order_items.count'].value}))

  const options: Highcharts.Options = {
    title: {
        text: 'Sales Volume by Day'
    },
    // xAxis: {
    //   categories: cool.data.map(row => {return row['order_items.created_date'].value}),
    // },    
    series: [
      {
        type: 'line',
        data: data2.map(row => {return row['order_items.count'].value})
      }
  ]
    
}

 

  return (
    <>
      <Heading my="xlarge">Sales Volume by Day</Heading>
      <Box display="flex" flexDirection="row">
        <Box display="flex" flexDirection="column" width="100%">
          <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>

        </Box>
      </Box>
    </>
  )
}

const StyledPre = styled.pre`
  margin: 0 0 0 20px;
  border: 1px solid #c1c6cc;
  height: 100%;
  padding: 20px;
`
