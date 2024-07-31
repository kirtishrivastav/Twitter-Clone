
import LeftSidePanel from "../LeftPanel/LeftSidePanel"
import './Home.css'

import { Outlet } from "react-router-dom";


function Home() {

  return (

    <>
    
     <div className='main-layout'>
        <div className='left-panel'>
          <LeftSidePanel />
        </div>
        <div className='mid-content'>
          <Outlet />
        </div>
      </div>
   
    </>
  )
}

export default Home
