import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import CreateCourseForm from '../components/createCourseForm'

function CreateCourse() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
   
    /*useEffect(() => {
        if(!user){
            navigate('/login')
        }

    }, [user, navigate])*/

  return (
    <>

    <CreateCourseForm/>
    
   </>
  )
}

export default CreateCourse
