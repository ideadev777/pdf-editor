import * as React from 'react'
import { useDrag } from 'react-dnd'
import { Divider, Layout, Tooltip, Typography } from 'antd'
import styled from 'styled-components'
import { Scrollbar } from 'smooth-scrollbar-react'
import { Field, FieldProperties } from '../types'
import { HolderOutlined } from '@ant-design/icons'

import Icon from './Icons';

interface Props {
  templates: Array<FieldProperties>,
  selected: Field|null,

  onSelectedChange: (item: Field|null) => void
}

const { Sider } = Layout

const Container = styled(Sider)`
  background-color: white !important;
  border-right: solid 1px lightgray;
  z-index: 1;
`

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 10px;

  &:hover {
    background-color: #f0f0f0; /* Change the background color on hover */
  }
  &.active {
    background-color: #f0f0f0; /* Change the background color on hover */
  }
`

const defaultFields: Field[] = [
  {
    icon: 'user',
    title: 'First Name and Last Name'
  },
  {
    icon: 'envelope',
    title: 'Email'
  },
  {
    icon: 'calendar',
    title: 'Date field'
  },
  {
    icon: 'id',
    title: 'Document id'
  },
  {
    icon: 'home',
    title: 'Address'
  },
  {
    icon: 'cursor',
    title: 'Text field'
  },
  {
    icon: 'number',
    title: 'Numeric field'
  },
  {
    icon: 'choice',
    title: 'Multiple choice'
  },
  {
    icon: 'image',
    title: 'Image field'
  },
]

const Toolbox = ({templates, selected, onSelectedChange}: Props) => {
  const [collapsed, setCollapsed] = React.useState(false);
  
  const handleSelect = (item: any) => {
    if(selected === item) {
      onSelectedChange(null)
    } else {
      onSelectedChange(item)
    }
  }

  return (
    <Container 
      width={260} 
      collapsible
      zeroWidthTriggerStyle={{ 
        position: 'absolute', 
        top: '50vh', 
        right: '-30px', 
        width: '30px',  
      }} 
      collapsedWidth={0} 
      collapsed={collapsed} 
      className={collapsed?'':'active'} 
      onCollapse={()=>setCollapsed(!collapsed)} 
      >
      <Scrollbar style={{  padding: collapsed ? '' : '10px 15px 10px 10px', height: 'calc(100vh - 64px)' }}>
        <Typography.Title hidden={collapsed} level={5}>Suggested Fields</Typography.Title>
        <Typography.Text hidden={collapsed}>Drag the fields to your document template.</Typography.Text>
        {
          defaultFields.map((item: Field, index: number) => {
            useDrag(() => ({
              type: 'field',
              collect: monitor => ({
                isDragging: !!monitor.isDragging(),
              }),
            }))
            if (collapsed) {
              return (
                <Tooltip title={item.title} key={index} placement="right">
                  <ItemContainer style={{ justifyContent: 'center' }} onClick={()=>handleSelect(item)} className={(selected && item.title === selected.title) ?'active': ''}>
                    <Icon name={item.icon} />
                  </ItemContainer>
                </Tooltip>
              )
            } else {
              return (
                <ItemContainer onClick={()=>handleSelect(item)} key={index} className={(selected && item.title === selected.title) ?'active': ''}>
                  <div>
                    <Icon name={item.icon} />
                    <span style={{ marginLeft: '5px' }}>
                      {item.title}
                    </span>
                  </div>
                  <HolderOutlined />
                </ItemContainer>
              )
            }
          })
        }
        {(templates && templates.length > 0) && <Divider />}

        {(templates && templates.length > 0) && <Typography.Title hidden={collapsed} level={5}>Added Fields</Typography.Title>}
        {(templates && templates.length > 0) && <Typography.Text hidden={collapsed}>You can reuse the added fields to fill them only once when using the template.</Typography.Text>}
      </Scrollbar>
    </Container>
  )
}

export default Toolbox;