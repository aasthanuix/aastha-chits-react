import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Schemes from '../../Components/ChitSchemes/Schemes'
import Footer from '../../Components/Footer/Footer'
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb'

const ChitPlans = () => {
  return (
    <div className='chit-plans'>
      <Navbar />
      <Breadcrumb title="Schemes of Aastha Chits"/>
      <Schemes />
      <Footer />
    </div>
  )
}

export default ChitPlans
