'use client'

import BlueButton from '@/components/buttons/BlueButton'
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import Link from 'next/link'
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db } from "./firebase"
import { useState } from 'react'

const Home = () => {
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) return

    try {
      setLoading(true)
      await addDoc(collection(db, "feedback"), {
        message: feedback,
        createdAt: Timestamp.now(),
      })
      setFeedback("")
      alert("Thank you for your feedback! 💙")
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <NavBar />
      
      {/* Hero Stats Section */}
      <div>
        <ul className='bluewrap'>
          <li><h1 className='text-white'>10k+ USER</h1><h2 className='text-white'>Trust Our Website</h2></li>
          <li><h1 className='text-white'>1000k PET</h1><h2 className='text-white'>Registered</h2></li>
          <li><h1 className='text-white'>67k EVENTS</h1><h2 className='text-white'>Recieved</h2></li>
          <li><h1 className='text-white'>999k USED</h1><h2 className='text-white'>Tracking pet</h2></li>
        </ul>
      </div> 

      {/* Hero Section */}
      <div className="flex w-full h-screen justify-center p-5 items-center bg-blue-100 bg-[url('/images/syringe-on-dog.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
        <div className="flex-1">
          <h1>Because your pet<br/>deserve better care</h1>
          <Link className='commonbtn2' href='/'>GET STARTED ➜</Link>
          <h2>Contact us : XXX-XXX-XXX </h2>
        </div>
        <div className='flex-1'>
          <img src="/images/cat-and-dog.png" alt="Cat and Dog" />
        </div>
      </div>

      {/* About Section */}
      <div className="flex w-full h-screen justify-center p-5 items-center bg-blue-100">
        <div className="flex-1">
          <img src="/images/man-pat-dog.png" alt="Man patting dog" />
        </div>
        <div className='flex-1'>
          <h1>About us</h1>
          <h3 className='w-3/4'>PetCare🐾 brings technology and love together to care for pets.<br/>Track feeding, plan events, and monitor health — all in one simple, friendly website.</h3>
          <Link className='commonbtn2' href='/'>GET STARTED ➜</Link>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="flex w-full h-screen justify-center p-5 items-center bg-blue-200 bg-[url('/images/pawprints.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
        <div className="flex-1 items-center justify-center p-3 ">
          {/* 1. Added onSubmit handler to form */}
          <form onSubmit={submitFeedback}>
            <p className='block w-2/3 mx-auto font-bold text-4xl text-black bg-white border-black border-4 rounded-full p-3 text-center'>TKS U FOR USING OUR WEBSITE</p><br/>
            
            {/* 2. Changed 'form' to 'htmlFor' for accessibility */}
            <label htmlFor="feedback">
              <h2>We truly appreciate your feedback! Feel free to contact us anytime at </h2>
            </label><br/>

            {/* 3. Connected value and onChange to state */}
            <textarea 
              className="block mx-auto w-3/4 h-60 bg-white text-black border-4 border-black p-4 font-bold resize-none outline-0" 
              id="feedback" 
              name="feedback" 
              placeholder="Your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
            <br/>

            <div className="flex justify-center">
              {/* 4. Ensure button type is submit */}
              <BlueButton type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </BlueButton>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home