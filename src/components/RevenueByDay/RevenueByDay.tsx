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
import { List, Dictionary } from "lodash";

export const RevenueByDay =  () => {
  const [messages, setMessages] = React.useState("")
  const [data, setData] = React.useState([])
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK

  const updateMessages = (message: string) => {
    setMessages(prevMessages => {
      const maybeLineBreak = prevMessages.length === 0 ? '' : '\n'
      return `${prevMessages}${maybeLineBreak}${message}`
    })
  }

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
            limit: 10,
            body: {
              total: true,
              model: model,
              view: explore,
              fields: fields,
              limit: limit,
              filters: filters,
              sorts: sorts
            }
          })
          .then((response) => {
            if (response.ok) {
              const x = response.value.data.map(row => {return row['order_items.created_date'].value})
              const y = response.value.data.map(row => {return row['order_items.total_sale_price'].value})
              resolve(y)
            } else {
              updateMessages('Network Error')
            }
          })
          .catch(error => updateMessages('Code error'))   
      })
     
    }
  
    const data1 = await myInlineApiCall(
                      "thelook", 
                      "order_items", 
                      ["order_items.created_date","order_items.total_sale_price"], 
                      ["order_items.created_date desc"],
                      "35",
                      {"category.name":"socks"}
                     )
    console.log(data1)
    setData(data1)

  }

  const options: Highcharts.Options = {
    title: {
        text: 'My chart'
    },
    series: [
      {
        type: 'line',
        // data: [1, 2, 3, 4, 5, 6, 7]
        data: data
      }
  ]
    
}


  const allConnectionsClick = () => {
      sdk.all_connections()
      .then((response) => {
        if (response.ok) {
          response.value.forEach(connection => {
            updateMessages(connection.name || '')
          })
        } else {
          updateMessages('Error getting connections')
        }
      })
      .catch(error => updateMessages('Error getting connections'))
  }

  const searchFoldersClick = () => {
    sdk.search_folders({ parent_id: '1'})
    .then((response) => {
      if (response.ok) {
        updateMessages(JSON.stringify(response.value, null, 2))
      } else {
        updateMessages('Error invoking search folders')
      }
    })
    .catch(error => updateMessages('Error invoking search folders'))
  }


  const inlineQueryClick = () => {
    // alternate mechanism to get sdk.
    getCoreSDK()
      .run_inline_query({
        result_format: "json_detail",
        limit: 10,
        body: {
          total: true,
          model: "thelook",
          view: "users",
          fields: ["last_name", "gender"],
          sorts: [`last_name desc`]
        }
      })
      .then((response) => {
        if (response.ok) {
          updateMessages(JSON.stringify(response.value, null, 2))
        } else {
          updateMessages('Error invoking inline query')
        }
      })
      .catch(error => updateMessages('Error invoking inline query'))
  }

  const clearMessagesClick = () => {
    setMessages('')
  }

  return (
    <>
      <Heading my="xlarge">Revenue by Day</Heading>
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
