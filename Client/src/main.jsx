import { AppContextProvider } from './context/AppContext.jsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <App></App>
  </AppContextProvider>
)
