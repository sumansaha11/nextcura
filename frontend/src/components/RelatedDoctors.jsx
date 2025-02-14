import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';

const RelatedDoctors = ({ speciality, docId }) => {
    const navigate = useNavigate();

    const { doctors } = useContext(AppContext);
    const [relDocs, setRelDocs] = useState([]);

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDocs(doctorsData)
        }
    }, [doctors, speciality, docId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            <h1 className='text-3xl font-medium'>Related Doctors</h1>
            <p className='sm:w-1/2 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
            <div className='w-full grid grid-cols-(--auto) gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {relDocs.slice(0, 5).map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='bg-white border border-blue-400 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img className='bg-blue-50 ' src={item.image.url} alt="" />
                        <div className='p-4'>
                            <div className=' flex items-center gap-2 text-sm text-center text-green-500'>
                                {
                                    item.available ?
                                        <div className=' flex items-center gap-2 text-sm text-center text-green-500'>
                                            <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                                        </div>
                                        :
                                        <div className=' flex items-center gap-2 text-sm text-center text-gray-500'>
                                            <p className='w-2 h-2 bg-gray-500 rounded-full'></p><p>Not Available</p>
                                        </div>
                                }
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                            <p className='text-gray-600 text-sm'>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default RelatedDoctors;