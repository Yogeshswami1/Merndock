import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 🟢 Ant Design reset CSS FIRST
import 'antd/dist/reset.css'

// 🔵 Then your own CSS
import './index.css'

// 🔴 App component
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
