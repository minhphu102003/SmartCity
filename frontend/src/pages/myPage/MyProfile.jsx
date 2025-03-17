import React, { useState } from 'react';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: 'Phuc Tien',
    email: 'nguyenhoangphuctien190903@gmail.com',
    phone: '+99 905 243 599',
    address: {
      line1: '56 Dang Dung',
      line2: 'Lien Chieu, Da Nang',
    },
    gender: 'Male',
    dob: '2003-09-19',
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-400">
      <button
        className="ml-20 absolute left-5 top-5 flex items-center gap-2 px-4 py-2 bg-white shadow-lg rounded-full text-gray-700 font-semibold hover:bg-gray-200 transition"
        onClick={() => window.history.back()}
      >
        <ArrowLeftIcon className="w-5 h-5" /> Back
      </button>
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <div className="flex max-w-lg flex-col gap-2 rounded-lg bg-white p-6 text-sm shadow-lg">
          <img
            className="mx-auto h-36 w-36 rounded-full border-4 border-gray-300 shadow-md"
            src={require('../../assets/images/profile_pic.png')}
            alt="Profile"
          />

          {isEdit ? (
            <input
              className="mt-4 max-w-60 bg-gray-50 text-center text-3xl font-medium"
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <p className="mt-4 text-center text-3xl font-medium text-neutral-800">
              {userData.name}
            </p>
          )}

          <hr className="my-3 h-[1px] border-none bg-gray-300" />

          <div>
            <p className="font-semibold text-neutral-500 underline">
              CONTACT INFORMATION
            </p>
            <div className="mt-3 grid grid-cols-[1fr_3fr] gap-y-3 text-neutral-700">
              <p className="font-medium">Email:</p>
              <p className="text-blue-500">{userData.email}</p>
              <p className="font-medium">Phone:</p>
              {isEdit ? (
                <input
                  className="w-full rounded bg-gray-100 p-1"
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <p className="text-blue-400">{userData.phone}</p>
              )}
              <p className="font-medium">Address:</p>
              {isEdit ? (
                <div>
                  <input
                    className="w-full rounded bg-gray-100 p-1"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={userData.address.line1}
                    type="text"
                  />
                  <input
                    className="mt-1 w-full rounded bg-gray-100 p-1"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={userData.address.line2}
                    type="text"
                  />
                </div>
              ) : (
                <p className="text-gray-500">
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="mt-3 font-semibold text-neutral-500 underline">
              BASIC INFORMATION
            </p>
            <div className="mt-3 grid grid-cols-[1fr_3fr] gap-y-3 text-neutral-700">
              <p className="font-medium">Gender:</p>
              {isEdit ? (
                <select
                  className="max-w-20 rounded bg-gray-100 p-1"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  value={userData.gender}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-gray-400">{userData.gender}</p>
              )}
              <p className="font-medium">Birthday:</p>
              {isEdit ? (
                <input
                  className="max-w-28 rounded bg-gray-100 p-1"
                  type="date"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  value={userData.dob}
                />
              ) : (
                <p className="text-gray-400">{userData.dob}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg active:scale-95"
              onClick={() => setIsEdit(!isEdit)}
            >
              {isEdit ? 'Save Information' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
