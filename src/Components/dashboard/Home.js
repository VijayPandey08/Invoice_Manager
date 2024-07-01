import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const Home = () => {
  const [total, setTotal] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(12);
  const [totalMonthCollection, setTotalMonthCollection] = useState(12345);
  const [invoices, setInvoices] = useState([])

  let chartInstance = null; // Variable to store the chart instance

  useEffect(() => {
    getData()
    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);


  const montWiseCollection = (data) => {
    const chartData = {
      "Jan": 0,
      "Feb": 0,
      "Mar": 0,
      "Apr": 0,
      "May": 0,
      "Jun": 0,
      "Jul": 0,
      "Aug": 0,
      "Sep": 0,
      "Oct": 0,
      "Nov": 0,
      "Dec": 0
    }
    data.forEach(d => {
      if (new Date(d.date.seconds * 1000).getFullYear() === new Date().getFullYear()) {
        const month = new Date(d.date.seconds * 1000).toLocaleString('default', { month: 'short' });
        chartData[month] += d.total;
      }
    })
    createChart(chartData);
  }

  const createChart = (chartData) => {
    const ctx = document.getElementById('myChart');
    if (ctx && chartInstance) {
      chartInstance.destroy(); // Safely destroy the existing chart instance
    }

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(chartData),
        datasets: [{
          label: 'Month Wise Collection',
          data: Object.values(chartData),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const getData = async () => {
    const q = query(collection(db, "invoices"), where('uid', "==", localStorage.getItem('uid')))
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setInvoices(data)
    getOverlAllTotal(data)
    getMonthTotal(data)
    montWiseCollection(data)
  }

  const getOverlAllTotal = (invoiceList) => {
    let t = 0;
    invoiceList.forEach(data => {
      t += data.total
    })
    setTotal(t)
  }

  const getMonthTotal = (invoiceList) => {
    let mt = 0;
    invoiceList.forEach(data => {
      if (new Date(data.date.seconds * 1000).getMonth() === new Date().getMonth()) {
        mt += data.total
      }
    })
    setTotalMonthCollection(mt)
  }

  return (
    <div>
      <div className='home_first_row'>
        <div className='home_box box1'>
          <h1 className='box_header'>Rs {total}</h1>
          <p className='box_title'>Overall</p>
        </div>
        <div className='home_box box2'>
          <h1 className='box_header'>{invoices.length}</h1>
          <p className='box_title'>Total Invoices</p>
        </div>
        <div className='home_box box3'>
          <h1 className='box_header'>Rs {totalMonthCollection}</h1>
          <p className='box_title'>This Month</p>
        </div>
      </div>

      <div className='home_second_row'>
        <div className='chart_box'>
          <canvas id="myChart"></canvas>
        </div>
        <div className='recent_invoices'>
          <h1>Recent Invoices</h1>
          <div>
            <p>Customer Name</p>
            <p>Date</p>
            <p>Total</p>
          </div>
          {
            invoices.slice(0,5).map(data=>(
              <div>
            <p>{data.to}</p>
            <p>{new Date(data.date.seconds*1000).toLocaleDateString()}</p>
            <p>{data.total}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
