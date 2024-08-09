import {useEffect, useState} from 'react'
import axios from 'axios'

const Data = () => {
    const [data, setData] = useState([])
    
    // For testing
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getData = async() => {
        try {
            const response = await axios.get("http://localhost:3000/api/restaurant/")
            console.log("Response data: ", response.data)
            if(Array.isArray(response.data)){
                setData(response.data)
            } else{
                setError("Unexpected response format")
            }
        } catch (error) {
            console.error("Error fetching data: ", error)
            setError("Error")
        } finally{
            setLoading(false)
        }

    }

    useEffect(()=> {
        getData()
    }, [])

    if(loading) {
        return <div>Loading..</div>
    }
    if(error){
        return <div>{error}</div>
    }

    return (
        <div>
            {data.map((item)=> (
            <div key={item.id}> 
                <h3>{item.businessName}</h3>
                <p>{item.category}</p>
                <p>{item.address}</p>
                <p>{item.operationTime}</p>
            </div> 
            ))}
        </div>
    )
}

export default Data