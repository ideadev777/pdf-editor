import * as React from 'react'
import { Button, Divider, Flex, Input, Space } from 'antd'
import styled from 'styled-components'
import { CaretLeftOutlined, CaretRightOutlined, SearchOutlined, ZoomOutOutlined, ZoomInOutlined } from '@ant-design/icons'
import { Settings } from '../types'

const ToolBarContainer = styled(Flex) `
  background-color: #fcfdfe;
  padding: 10px;
`

interface Props {
  settings: Settings
  updateSettings: (setting: Settings) => void
}

const Toolbar = ({settings, updateSettings}: Props) => {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)
  const [scale, setScale] = React.useState(1)
  
  const prevPage = () => {
    updateSettings({
      ...settings,
      currentPage: currentPage - 1
    })
  }

  const nextPage = () => {
    updateSettings({
      ...settings,
      currentPage: currentPage + 1
    })
  }

  const handleChange = (e: any) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page > 0 && page <= totalPage) {
      updateSettings({
        ...settings,
        currentPage: page
      })
    }
  }

  const handleZoom = (inc: boolean) => {
    let val = inc ? scale + 0.1 : scale - 0.1
    updateSettings({
      ...settings,
      scale: parseFloat(val.toFixed(1))
    })
  }

  React.useEffect(()=>{    
    setTotalPage(settings.totalPage)
    setCurrentPage(settings.currentPage)
    setScale(settings.scale)    
  }, [settings])

  return (
    <ToolBarContainer justify='space-between' align='center'>
      <Space>
        <Space align='center'>
          <span>Page</span>
          <Space.Compact>
            <Button disabled={currentPage === 1} onClick={prevPage} icon={<CaretLeftOutlined />}/>
            <Input onChange={handleChange} value={currentPage} style={{ width: 100, textAlign: 'center'}}/>
            <Button disabled={currentPage === totalPage} onClick={nextPage} icon={<CaretRightOutlined />}/>
          </Space.Compact>
          <span>
            of { totalPage }
          </span>
        </Space>
        <Divider type='vertical' />
        <Space>
          <Button disabled={scale <= 0.5} icon={<ZoomOutOutlined onClick={()=>handleZoom(false)} />} />
          <Button disabled={scale >= 2} icon={<ZoomInOutlined onClick={()=>handleZoom(true)} />} />
        </Space>

        <Divider type='vertical' />
      </Space>
      <Button icon={<SearchOutlined />} />
    </ToolBarContainer>
  )
}

export default Toolbar;