import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const InvoiceDetails = () => {
  const location = useLocation()
  const [data,setData] = useState(location.state)

  const printInvoice = ()=>{
    const input = document.getElementById('invoice')
    html2canvas(input,{useCORS: true})
    .then((canvas)=>{
      const imageData = canvas.toDataURL('image/png',1.0)
      const pdf = new jsPDF({
        orientation: 'potrait',
        unit: 'pt',
        format:[612,792]
      })
      pdf.internal.scaleFactor = 1
      const imageProps = pdf.getImageProperties(imageData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imageProps.height * pdfWidth) / imageProps.width
      pdf.addImage(imageData, 'PNG', 0, 0,pdfWidth,pdfHeight)
      pdf.save('invoice' + new Date())
    })

  }

  return (
    <div>
      <div className='invoice_btn'>
      <button onClick={printInvoice} className='print_btn'>Print Invoice</button>
      </div>
      <div id="invoice" className='invoice_wrapper'>
        <div className='invoice_header'>
          <div className='company_detail'>
               <img className='company_logo' src={localStorage.getItem('photoURL')} alt="" />
               <div className='company_name_mail'>
               <p className='company_name'>{localStorage.getItem('cNAME')}</p>
               <p>{localStorage.getItem('cEMAIL')}</p>
               </div>


          </div>
          {/* <div className='company_name'>
            <p>{localStorage.getItem('phone')}</p>
          </div> */}
          <div className='customer_detail'>
            <div className='invoice_heading'>
               <h1 className='customer_detail'>Invoice</h1>
            </div>
            <div className='receiver_detail'>
            <p>To:-{data.to}</p>
               <p>Date:-{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
               <p>Email:-{data.email}</p>
               <p>Phone:-{data.phone}</p>
            </div>
          </div>
        </div>
        <hr></hr>
           <table className='product_table'>
           <thead>
           <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
           </thead>
           <tbody>
            {
              data.product.map((data,index)=>(
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{data.name}</td>
                  <td>{data.price}</td>
                  <td>{data.quantity}</td>
                  <td>{data.quantity * data.price}</td>
                </tr>
              ))
            }
           </tbody>
           <tfoot>
            <tr>
              <td colSpan="4">Total</td>
              <td>
                {data.total}
              </td>
            </tr>
           </tfoot>
           </table>
      </div>
    </div>
  )
}

export default InvoiceDetails
