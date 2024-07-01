// import React, { useEffect, useState } from "react";
// import { db } from "../../firebase";
// import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const Invoices = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getData();
//   }, []);

//   const getData = async () => {
//     setLoading(true);
//     try {
//       const q = query(
//         collection(db, "invoices"),
//         where("uid", "==", localStorage.getItem("uid"))
//       );
//       const querySnapshot = await getDocs(q);
//       const data = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setInvoices(data);
//     } catch (error) {
//       console.error("Error fetching invoices: ", error);
//     }
//     setLoading(false);
//   };

//   const deleteInvoice = async (id) => {
//     const isSure = window.confirm("This will permanently delete the invoice");
//     if (isSure) {
//       try {
//         await deleteDoc(doc(db, "invoices", id));
//         getData();
//       } catch (error) {
//         console.error("Error deleting invoice: ", error);
//         window.alert("Something went wrong");
//       }
//     }
//   };

//   return (
//     <div>
//       {loading ? (
//         <div style={{ display: "flex", height: '100vh', justifyContent: "center", alignItems: "center" }}>
//           <i style={{fontSize:30}} class="fa-solid fa-spinner fa-spin-pulse"></i>
//         </div>
//       ) : 
//        (
//         invoices.map((data) => (
//           <div className="box" key={data.id}>
//             <p>{data.to}</p>
//             <p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
//             <p>{data.email}</p>
//             <p>Rs.{data.total}</p>
//             <button
//               onClick={() => {
//                 deleteInvoice(data.id);
//               }}
//               className="invoice_del_btn"
//             >
//               Delete
//             </button>
//             <button
//               onClick={() => {
//                 navigate("/dashboard/invoice-details", { state: data });
//               }}
//               className="invoice_del_btn invoice_view_btn"
//             >
//               View
//             </button>
//           </div>
//         ))
//       )
//       (
//         {
//           invoices.length < 1 && 
//             <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: '100vh' }}>
//               <p>No invoices found</p>
//               <button>Create New Invoice</button>
//             </div>
//         }
//       )
//       }
//     </div>
//   );
// };

// export default Invoices;


import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingData, setProcessingData] = useState(false); // New state variable
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    setProcessingData(true); // Start processing data
    try {
      const q = query(
        collection(db, "invoices"),
        where("uid", "==", localStorage.getItem("uid"))
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
       ...doc.data(),
      }));
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices: ", error);
    } finally {
      setLoading(false);
      setProcessingData(false); // End processing data
    }
  };

  const deleteInvoice = async (id) => {
    const isSure = window.confirm("This will permanently delete the invoice");
    if (isSure) {
      try {
        await deleteDoc(doc(db, "invoices", id));
        getData();
      } catch (error) {
        console.error("Error deleting invoice: ", error);
        window.alert("Something went wrong");
      }
    }
  };

  return (
    <div>
      {(loading || processingData)? ( // Adjusted condition to include processingData
        <div style={{ display: "flex", height: '100vh', justifyContent: "center", alignItems: "center" }}>
          <i style={{fontSize:30}} class="fa-solid fa-spinner fa-spin-pulse"></i>
        </div>
      ) : (
        invoices.length > 0? (
          invoices.map((data) => (
            <div className="box" key={data.id}>
              <p>{data.to}</p>
              <p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
              <p>{data.email}</p>
              <p>Rs.{data.total}</p>
              <button
                onClick={() => {
                  deleteInvoice(data.id);
                }}
                className="invoice_del_btn"
              >
               <i class="fa-solid fa-trash"></i>    Delete
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard/invoice-details", { state: data });
                }}
                className="invoice_del_btn invoice_view_btn"
              >
               <i class="fa-regular fa-eye"></i>  View
              </button>
            </div>
          ))
        ) : (
          <div className="no_invoice_wrapper">
            <h1 >No Invoices Found</h1>
            <button onClick={()=>{navigate('/dashboard/new-invoice')}}>Create New Invoice</button>
          </div>
        )
      )}
    </div>
  );
};

export default Invoices;
