import React, { useMemo, useRef, useState, useEffect } from 'react';
import { CloseOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Collapse, Input, Layout, Space, Select, Slider, Typography, List, Divider } from 'antd';
import { ChromePicker } from 'react-color';

import { styled } from 'styled-components';
import { Scrollbar } from 'smooth-scrollbar-react';

import { FieldProperties } from '../types'
const EmptyContainer = styled.div`
  width: 100%;
`
const UploadButton = styled(Button)`
  border-radius: 0 5px 5px 0 !important;
`
const PopOverContainer = styled.div`
  position: absolute;
  top: 2px;
  right: 0px;
  z-index: 2;
`
const { Sider } = Layout;

interface Props {
  active: FieldProperties | null,
  fieldsets: FieldProperties[],
  currentPage: number,
  onRemoveField: (id: string) => void,
  onUpdateFields: (field: FieldProperties) => void,
  onActiveChange: (fields: FieldProperties | null) => void
}

const fontList = [
  {
    'label': 'Courier',
    'value': 'Courier'
  },
  {
    'label': 'Courier Bold',
    'value': 'CourierBold'
  },
  {
    'label': 'Helvetica',
    'value': 'Helvetica'
  },
  {
    'label': 'HelveticaBold',
    'value': 'HelveticaBold'
  },
  {
    'label': 'TimesRoman',
    'value': 'TimesRoman'
  },
  {
    'label': 'TimesRoman Bold',
    'value': 'TimesRomanBold'
  }
]

const Properties = (props: Props) => {  
  const [collapsed, setCollapsed] = useState(false);
  const [border, setBorder] = useState(false)
  const [background, setBackground] = useState(false)

  const inputFile = useRef<any>(null)

  const handleActive = (item: FieldProperties | null) => {
    props.onActiveChange(item)
  }

  const handleRemove = () => {
    console.log('item removed: ', props.active);
    
    props.onRemoveField(props.active?._id as string)
    props.onActiveChange(null)
  }

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (border) {
        // Check if the click target is outside of the item
        const item = document.querySelector('.border'); // Replace with your selector
        if (item && !item.contains(event.target)) {
          setBorder(false);
        }
      }
    };
  
    document.addEventListener('click', handleOutsideClick);
  
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [border]);
  
  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (background) {
        // Check if the click target is outside of the item
        const item = document.querySelector('.background'); // Replace with your selector
        if (item && !item.contains(event.target)) {
          setBackground(false);
        }
      }
    };
  
    document.addEventListener('click', handleOutsideClick);
  
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [background]);

  const isValidHexColor = (color: string): boolean => {
    // Regular expression for a valid hexadecimal color code
    const hexColorPattern = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  
    return hexColorPattern.test(color) || !color;
  }

  const handleFileChange = (e: any) => {
    if (!e.target.files) return; // Check for the presence of files
    const selectedFile = e.target.files[0];
    if(selectedFile) {
      const reader = new FileReader();
  
      reader.onload = function() {
        let updated = props.active as FieldProperties
        updated.data = URL.createObjectURL(selectedFile)
        const fileName = selectedFile.name;
        updated.ext = fileName.split('.').pop();
        props.onUpdateFields(updated)
        props.onActiveChange(updated)
      };
  
      reader.readAsArrayBuffer(selectedFile);
    }
  }


  const handleChangeActive = (item: string, value: any) => {
    let update: boolean = false
    let modify: FieldProperties = props.active as FieldProperties
    switch (item) {
      case 'data':
        modify.data = value
        update = true
        break;
      case 'data-list':
        if(!Array.isArray(modify.data)) break;
        modify.data[value.index] = {title: value.data, check: false}
        update = true
        break;
      case 'data-list-new':
        if(!Array.isArray(modify.data)) break;
        modify.data.push({title: value, check: false})
        update = true
        break;
      case 'data-list-remove':
        if(!Array.isArray(modify.data)) break;
        modify.data.splice(value, 1)
        update = true
        break;
      case 'family':
        modify.font = {
          ...modify.font,
          family: value
        }
        update = true
        break;
      case 'size':
        if(isFinite(parseInt(value))) {
          modify.font = {
            ...modify.font,
            size: value
          }
          update = true
        }
        break;
      case 'width':
        if(isFinite(parseInt(value))) {
          modify.container = {
            ...modify.container,
            width: value
          }
          update = true
        }
        break;
      case 'height':
        if(isFinite(parseInt(value))) {
          modify.container = {
            ...modify.container,
            height: value
          }
          update = true
        }
        break;
      case 'size':
        if(isFinite(parseInt(value))) {
          modify.container = {
            ...modify.container,
            height: value
          }
          update = true
        }
        break;
      case 'borderColor':
        modify.container = {
          ...modify.container,
          border: value
        }
        update = true
        break;
      case 'backColor':
        modify.container = {
          ...modify.container,
          background: value
        }
        update = true
        break;
      case 'metadata':
        modify = {
          ...modify,
          metadata: value
        }
        update = true
        break;
      case 'opacity':
        if(isFinite(parseInt(value))) {
          modify.container = {
            ...modify.container,
            opacity: value
          }
          update = true
        }
        break;
      case 'posX':
        if(isFinite(parseInt(value))) {
          modify.position = {
            ...modify.position,
            x: value
          }
          update = true
        }
        break;
      case 'posY':
        if(isFinite(parseInt(value))) {
          modify.position = {
            ...modify.position,
            y: value
          }
          update = true
        }
        break;    
      default:
        update = false
        break;
    }
    if(update) {
      console.log('updated: ', modify);
      
      props.onActiveChange(modify)
      props.onUpdateFields(modify)
    }
  }

  const renderListItem = (item: any): React.ReactNode => {
    return (
      <List.Item actions={[<Button type='primary' onClick={()=>handleActive(item)} icon={<EditOutlined shape='circle' />} />]}>
        <List.Item.Meta
          style={{ alignItems: 'center' }}
          title={<Typography.Text>{item.type.title}</Typography.Text>}
        />
      </List.Item>
    )
  }

  const renderCurrentList = useMemo(() => {
    const renderList = props.fieldsets.filter((item: FieldProperties) => item.page === props.currentPage);
    return (
      <List
        size='small'
        itemLayout='horizontal'
        dataSource={renderList}
        header={<Typography.Title level={5}>Field List</Typography.Title>}
        renderItem={renderListItem}
        locale={{ emptyText: 'No Fields' }}
       />
    );

  }, [props.active, props.fieldsets, props.currentPage])

  return (
    <Sider 
      zeroWidthTriggerStyle={{ 
        position: 'absolute', 
        top: '50vh', 
        left: '-30px', 
        width: '30px',  
      }} 
      className={collapsed? '' : 'active'} 
      collapsed={collapsed} 
      onCollapse={()=>setCollapsed(!collapsed)} 
      style={{ 
        backgroundColor: 'white', 
        borderLeft: 'solid 1px lightgray', 
        zIndex: 1 
      }} 
      width={260} 
      collapsible 
      collapsedWidth={0}
      reverseArrow 
    >
      <Scrollbar style={{ padding: collapsed ? '' : '10px 15px 10px 10px', height: 'calc(100vh - 100px)' }}>
        {
          props.active ?
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography.Title level={5}>
                {props.active.type.title} Property
              </Typography.Title>
              <Divider />
              <Collapse>
                <Collapse.Panel key={props.active.type.icon === 'image' ?'img':'value'} header={ props.active.type.icon === 'image' ?'Url':'Value'}>
                  {
                    Array.isArray(props.active.data) ?
                    <Space direction='vertical'>
                      {
                        props.active.data.map((_item: string, index: number) => {
                          return <Space.Compact key={index}>
                            <Input placeholder="Value" value={props.active && props.active.data[index].title} onChange={e=>handleChangeActive('data-list', {index, data:e.target.value})}/>
                            <Button icon={<CloseOutlined />} onClick={() => handleChangeActive('data-list-remove', index)}/>
                          </Space.Compact>
                        })
                      }
                      <Button onClick={()=>handleChangeActive('data-list-new', '')}>Add new</Button>
                    </Space>
                    :
                    props.active.type.icon === 'image' ?
                    <Space.Compact>
                      <Input disabled placeholder="Url" defaultValue={props.active.data} value={props.active.data} onChange={e=>handleChangeActive('data', e.target.value)}/>
                      <UploadButton onClick={()=>inputFile.current.click()} icon={<UploadOutlined />} />
                      <input ref={inputFile} onChange={handleFileChange} type='file' accept='image/jpeg, image/png' hidden />
                    </Space.Compact>
                    :
                    <Input placeholder="Value" defaultValue={props.active.data} value={props.active.data} onChange={e=>handleChangeActive('data', e.target.value)}/>
                  }
                </Collapse.Panel>
                {
                  props.active.type.icon !== 'image' && <Collapse.Panel key={'font'} header={'Font Setting'}>
                    <Space direction='vertical'>
                      <Space.Compact style={{ width: '100%' }}>
                        <Button disabled style={{ backgroundColor: '#00000005', cursor: 'text', color: '#000000e0' }}>Family</Button>
                        <Select
                          style={{ flex: 1 }}
                          allowClear
                          value={props.active.font?.family}
                          onChange={e=>handleChangeActive('family', e)}
                          key={'label'}
                          options={fontList}
                        />
                      </Space.Compact>
                      <Input addonBefore={"Size"} value={props.active.font?.size} onChange={e=>handleChangeActive('size', e.target.value)}/>
                    </Space>
                  </Collapse.Panel>
                }
                <Collapse.Panel key={'container'} header={'Container Setting'}>
                  <Space direction='vertical'>
                    <Typography.Text>
                      Dimensions
                    </Typography.Text>
                      <Input value={props.active.container?.width} onChange={e=>handleChangeActive('width', e.target.value)} addonBefore={"Width"} addonAfter={"px"} />
                      <Input value={props.active.container?.height} onChange={e=>handleChangeActive('height', e.target.value)} addonBefore={"Height"} addonAfter={"px"} />

                    <Typography.Text>
                      Border
                    </Typography.Text>
                    <Space.Compact>
                      <div style={{ width: '3rem', border: 'solid 1px #d9d9d9', borderRadius: '5px 0 0 5px', backgroundColor: `${props.active.container?.border}`}}></div>
                      <Input onClick={()=>setBorder(true)} readOnly status={isValidHexColor(props.active.container?.border as string) ? '': 'error'} value={props.active.container?.border?.replace('#', '')}/>
                    </Space.Compact>
                    <div style={{ position: 'relative' }}>
                      {border && <PopOverContainer className='border'>
                        <ChromePicker color={props.active.container?.border} onChange={e=>handleChangeActive('borderColor', e.hex)} />
                      </PopOverContainer> }
                    </div>

                    <Typography.Text>
                      Background
                    </Typography.Text>
                    <div>
                      <Space.Compact>
                        <div style={{ width: '3rem', border: 'solid 1px #d9d9d9', borderRadius: '5px 0 0 5px', backgroundColor: `${props.active.container?.background}`}}></div>
                        <Input onClick={()=>setBackground(!background)} readOnly status={isValidHexColor(props.active.container?.background as string) ? '': 'error'} value={props.active.container?.background?.replace('#', '')}/>
                      </Space.Compact>
                      <div style={{ position: 'relative' }}>
                        {background && <PopOverContainer className='background'>
                          <ChromePicker color={props.active.container?.background} onChange={e=>handleChangeActive('backColor', e.hex)} />
                        </PopOverContainer> }
                      </div>
                    </div>

                    <Typography.Text>Opacity</Typography.Text>
                      <Slider value={props.active.container?.opacity || 100} onChange={(e: number)=>handleChangeActive('opacity', e.toFixed())}/>

                  </Space>
                </Collapse.Panel>
                <Collapse.Panel key={'position'} header={'Position Setting'}>
                  <Space direction='vertical'>
                    <Input value={props.active.position.x} onChange={e=>handleChangeActive('posX', e.target.value)} addonBefore={"X"} addonAfter={"px"} />
                    <Input value={props.active.position.y} onChange={e=>handleChangeActive('posY', e.target.value)} addonBefore={"Y"} addonAfter={"px"} />
                  </Space>
                </Collapse.Panel>
                <Collapse.Panel key={'meta'} header={'Meta Data'}>
                  <Input.TextArea rows={3} value={props.active.metadata} onChange={e=>handleChangeActive('metadata', e.target.value)}  />
                </Collapse.Panel>
              </Collapse>
              <Divider />
              <Space style={{ justifyContent: 'center' }}>
                <Button onClick={handleRemove} type='primary' danger>Delete</Button>
                <Button onClick={() => handleActive(null)}>Back</Button>
              </Space>
            </div>
          :
            <EmptyContainer>
              {renderCurrentList}
            </EmptyContainer>
        }
      </Scrollbar>
    </Sider>
  );
}

export default Properties;