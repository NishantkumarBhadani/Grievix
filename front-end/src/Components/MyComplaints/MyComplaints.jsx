import React, { useEffect, useState } from 'react'
import ComplaintCard from '../../utils/ComplaintCard'
import axios from 'axios'
import API_BASE_URL from '../../config/api'
import {useSelector} from "react-redux"

function MyComplaints() {
    const [complaints,setComplaints]=useState([]);
    const token=useSelector((state)=>state.auth.token);

//complaints fetching
   useEffect(()=>{
     const fetchComplaint=async()=>{
        try {
            const res=await axios.get(`${API_BASE_URL}/complaint/mycomplaints`,{
                headers:{Authorization: `Bearer ${token}`},
                withCredentials:true,
            })
            setComplaints(res.data.complaints || [])
        } catch (error) {
            console.log("Failed to fetch complaints:", error.response?.data || error.message)
        }
    }
    if(token){
        fetchComplaint();
    }
   },[token])
  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
       <h2 className="text-2xl font-bold text-emerald-700 mb-6">My Complaints</h2>

       {
        complaints.length > 0 ?(
            complaints.map((complaint)=>(
                <ComplaintCard key={complaint.id} complaint={complaint}/>
            ))
        ):(
            <p className="text-gray-600">No complaints found</p>
        )
       }
    </div>
  )
}

export default MyComplaints