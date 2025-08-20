import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import Breadcrumb from '../../Components/Breadcrumb/Breadcrumb'
import ChitBenefits from '../../Components/Benifits/ChitBenefits'
import ChitBenefitsCards from '../../Components/Benifits/ChitBenefitsCards'

const ChitsBenefits = () => {
  return (
    <div className='chits-benefits'>
      <Navbar />
      <Breadcrumb title="Chits Benefits"/>
      <ChitBenefits />
      <ChitBenefitsCards />
      <Footer />
    </div>
  )
}

export default ChitsBenefits
