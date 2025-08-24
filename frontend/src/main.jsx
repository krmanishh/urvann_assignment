import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import {Toaster} from 'react-hot-toast'
import {store} from './app/store.js'
import {RouterProvider} from 'react-router-dom'
import './index.css'
import {router} from './Routes/Routes.jsx'


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
    <RouterProvider router={router}/>
    <Toaster/>
    

      
    
  </StrictMode>
  </Provider>
)
