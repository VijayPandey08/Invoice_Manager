import React, { useRef, useState } from 'react'
import {storage, auth, db} from '../../firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

const Settings = () => {
  const first = useRef(null);

  const [email, setEmail] = useState(localStorage.getItem('email'))
  // const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState(localStorage.getItem('cNAME'));
  const [imageUrl, setImageUrl] = useState(localStorage.getItem('photoURL'));

  const updateCompanyName = () => {
     updateProfile(auth.currentUser, {
      displayName: displayName,
     })
     .then(res=>{
       localStorage.setItem('cNAME', displayName);
       updateDoc(doc(db,"users",localStorage.getItem('uid')),{
         displayName: displayName
        })
        .then(res=>{
        window.location.reload();
      })
     })
  }

  const onSelectFile = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  }

  const updateLogo = () =>{
        const fileRef = ref(storage,localStorage.getItem('photoURL'))
        console.log(fileRef._location.path_);
      const storageRef = ref(storage,fileRef._location.path_ );
      uploadBytesResumable(storageRef, file)
      .then(result=>{
          window.location.reload();
      })

  }

  return (
    <div>

      <div className='setting_wrapper'>
        <div className='profile_info update_cName'>
        <img onClick={() => { first.current.click()}} className='pro'  alt='profile_pic' src={imageUrl} />
        <input onChange={(e) => {onSelectFile(e)}} style={{ display: 'none' }} type="file" ref={first} />
        {file && <button onClick={()=>{updateLogo()}}   >Update Profile Pic</button>}
        </div>
        <div className='update_cName'>
          <input onChange={e=>{setDisplayName(e.target.value)}} type='text' placeholder='New Company Name'  />
          <button onClick={updateCompanyName}>Update</button>
          {/* <input on type='text' placeholder='Email' value={email} /> */}
        </div>

      </div>
    </div>
  )
}

export default Settings

