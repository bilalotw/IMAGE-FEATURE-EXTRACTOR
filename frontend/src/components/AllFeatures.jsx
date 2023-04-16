import { Checkbox } from "@material-tailwind/react"
import axios from "axios"
import { useEffect, useState } from "react"
export default function AllFeatures({ api_url, extract, setExtract }) {
    const [available, setAvailable] = useState([])
    const [loading, setLoading] = useState(false)
    const loadAvailable = () => {
        setLoading(true)
        axios.get(`${api_url}/extractable`)
            .then(({ data }) => {
                setAvailable(data)
                setLoading(false)
            })
    }
    useEffect(() => {
        loadAvailable()
        return () => setAvailable([])
    }, [])
    return (
        <div className="h-full w-full">
            {
                loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="capitalize">
                        {
                            available.map(
                                (av, i) => {
                                    return (
                                        <div key={`sel-opt-${av}-${i}`}>
                                            <Checkbox
                                                label={av.replace("_", " ")}
                                                id={`option-${av}`}
                                                checked={extract.includes(av)}
                                                onChange={
                                                    ({ target: checked }) => {
                                                        if (checked) {
                                                            setExtract((curr) => [...new Set([...curr, av])])
                                                        }
                                                        else {
                                                            setExtract((curr) => curr.filter(e => e != av))
                                                        }
                                                    }
                                                }
                                            />
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}