import React, { useEffect, useState } from "react";
import { 
  UserOutlined, 
  FileImageOutlined, 
  MailOutlined, 
  CalendarOutlined, 
  CheckSquareOutlined, 
  LayoutOutlined, 
  NumberOutlined, 
  EnvironmentOutlined, 
  FieldStringOutlined 
} from "@ant-design/icons";

const Icon = (props: any) => {
  const [icon, setIcon] = useState('user')

  useEffect(()=>{
    setIcon(props.name)
  }, [props])

  if(icon === 'user') return <UserOutlined />
  else if(icon === 'calendar')  return <CalendarOutlined />
  else if(icon === 'home') return <EnvironmentOutlined />
  else if(icon === 'number') return <NumberOutlined />
  else if(icon === 'envelope') return <MailOutlined />
  else if(icon === 'cursor') return <FieldStringOutlined />
  else if(icon === 'id') return <LayoutOutlined />
  else if(icon === 'choice') return <CheckSquareOutlined />
  else if(icon === 'image') return <FileImageOutlined />
  else return null
}

export default Icon;