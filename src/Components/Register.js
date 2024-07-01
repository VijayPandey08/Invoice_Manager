import React, { useRef, useState } from 'react';
import '../Components/Register.css';
import { auth, storage, db } from '../firebase';
import { createUserWithEmailAndPassword,  updateProfile } from 'firebase/auth';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const first = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const onSelectFile = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a new user account
      const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created successfully", newUserCredential);

      // Generate a unique filename based on displayName and current timestamp
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName} ${date}`);

      // Upload the file to Firebase Storage
      if (file) {
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
          (snapshot) => {
            // Handle progress, success, and errors
          },
          (error) => {
            setLoading(false);
            console.error(error);
          },
          async () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              console.log('File available at', downloadURL);
              // Update the user's profile
              await updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: downloadURL
              });

              // Save the user's details to Firestore
              setDoc(doc(db,"users", auth.currentUser.uid),{
                uid: auth.currentUser.uid,
                displayName: displayName,
                photoURL: downloadURL,
                email: email,
                phoneNumber: phone
              });

              // Navigate to the dashboard after successful registration
              navigate('/dashboard');
              setLoading(false);
              localStorage.setItem('cNAME', displayName);
              localStorage.setItem('cEMAIL', newUserCredential.user.email);
              localStorage.setItem('photoURL', downloadURL);
              localStorage.setItem('uid', auth.currentUser.uid);
              localStorage.setItem('cPHONE', phone);
            });
          }
        );
      }

    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <>
      <div className='mybody'>
        <div className="wrapper">
          <form onSubmit={submitHandler} action="">
            <h1>Sign Up</h1>
            <div className="input-box">
              <input onChange={(e) => { setEmail(e.target.value); }} type="text" placeholder="Email" required />
            </div>
            <div className="input-box">
              <input onChange={(e) => { setDisplayName(e.target.value); }} type="text" placeholder="Company Name" required />
            </div>
            <div  className="input-box">
              <input onChange={(e)=>{setPhone(e.target.value);}} type="tel" placeholder="Phone No" required />
            </div>
            <div>
              <input onChange={(e) => {onSelectFile(e)}} style={{ display: 'none' }} type="file" ref={first} />
            </div>
            <div className="input-box btn-box">
              <input type="button" value='choose your logo' className='choose_button' onClick={() => { first.current.click(); }}required />
            </div>
            <div className="input-box">
              <input onChange={(e) => { setPassword(e.target.value); }} type="password" placeholder="Password" required />
              <i className='bx bxs-lock-alt'></i>
            </div>
            {imageUrl !== null &&   <img className='image_preview' src={imageUrl} alt="preview" />}
            <button className="btn" type="submit"> {loading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>} Submit</button>
            <div className="register-link">
              <p>Already have an Account? <a href='/login'>Login</a></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
