import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { FaInfoCircle } from 'react-icons/fa';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state: any) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [avatar, setAvatar] = useState(currentUser.avatar); // Store avatar
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    
    // Check if the file is selected
    if (file) {
      // Check file type
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        alert('נא לבחור קובץ בפורמט PNG, JPG או JPEG.');
        return;
      }

      // Check file size
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('גודל הקובץ לא יכול לעלות על 5MB.');
        return;
      }

      // If both checks pass, read the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Update avatar state with Base64
        setFormData({ ...formData, avatar: reader.result }); // Include Base64 in formData
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/server/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const formattedJoinDate = new Date(currentUser.createdAt).toLocaleDateString('he-IL');

  return (
    <div className='p-8 max-w-4xl mx-auto my-16 bg-white rounded-xl shadow-lg mt-20' dir='rtl'>
      <h1 className='text-3xl font-semibold text-gray-800 text-center mb-6'>
        טוב לראות אותך שוב, {currentUser.username}!
      </h1>
      <div className='flex flex-col md:flex-row items-center justify-center gap-6 mb-8'>
        <img src={avatar} alt="profile" className='rounded-full h-36 w-36 object-cover shadow-md border-4 border-blue-500' />
        <div className='text-center md:text-right'>
          <h2 className='text-4xl font-bold text-gray-800'>{currentUser.username}</h2>
          <p className='text-lg text-gray-500'>{currentUser.email}</p>
          <p className='text-sm text-gray-400'> המשתמש נוצר בתאריך: {formattedJoinDate}</p>
        </div>
      </div>

      <p className='text-lg text-gray-700 text-center mb-8'>
        בעמוד זה ניתן לעדכן מידע אישי ופרטים נוספים 
      </p>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 mb-8'>
        {['username', 'email', 'password'].map((field, index) => (
          <div key={index} className='flex items-center'>
            <div className='w-11/12'>
              <input
                type={field === 'password' ? 'password' : field}
                placeholder={field === 'username' ? 'שם משתמש' : field === 'email' ? 'דואר אלקטרוני' : 'סיסמה'}
                defaultValue={currentUser[field]}
                id={field}
                onChange={handleChange}
                className='border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
              />
            </div>
            <div className='w-1/12 flex justify-center'>
              <div className='relative group'>
                <FaInfoCircle className='text-blue-500' />
                <div className='hidden group-hover:block absolute -top-8 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 text-right'>
                  {field === 'username' ? 'שם משתמש' : field === 'email' ? ' דואר אלקטרוני' : 'סיסמה'}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Image Upload Section */}
        <div className='flex items-center'>
          <div className='w-11/12'>
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleFileChange}
              className='border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
            />
          </div>
          <div className='w-1/12 flex justify-center'>
            <div className='relative group'>
              <FaInfoCircle className='text-blue-500' />
              <div className='hidden group-hover:block absolute -top-8 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 text-right'>
                העלאת תמונה
              </div>
            </div>
          </div>
        </div>
        <div className='-mt-3'><span className='text-sm text-gray-600 text-center '>בחר תמונה (תמיכה בפורמטים PNG, JPG, JPEG)</span></div>

        <button disabled={loading} className='bg-blue-600 text-white rounded-lg p-3 uppercase hover:bg-blue-700 transition disabled:opacity-70'>
          {loading ? <div className='loader'></div> : 'עדכן פרופיל'}
        </button>
      </form>

      <div className="flex justify-between items-center">
        <Link to='/RamakQuestionnaire' className='text-blue-700 hover:underline'>
          עדכון תכונות בשאלון
        </Link>
        <span onClick={handleSignOut} className='text-red-700 hover:underline cursor-pointer'>
          התנתקות
        </span>
      </div>

      {error && <p className='text-red-700 mt-5'>{error}</p>}
      {updateSuccess && <p className='text-green-700 mt-5 text-center'>המשתמש עודכן בהצלחה</p>}
    </div>
  );
}
