import { useEffect, useState } from 'react'
import './App.css'
import styled from 'styled-components'
import SinglePipeline from './Components/SingleProcess'

export interface Process {
    creation: number
    current_stage: number
    id: string
    name: string
    pipeline: object[]
    start: number
    status: string
    stop: string | null
    version: string
    [key: string]: any
}

interface dataStrux {
    'basecat1-processing': Process[]
}

function App() {
    const [processes, setProcesses] = useState<Process[] | null>(null)
    useEffect(() => {
        fetch(
            'https://frb.chimenet.ca/pipelines/v1/pipelines/?name=basecat1-processing'
        )
            .then((res) => res.json())
            .then((data: dataStrux) => {
                setProcesses(data['basecat1-processing'])
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        <>
            {!processes ? (
                'loading...'
            ) : (
                <AllProcessesLayout>
                    {processes.map((process, index) => {
                        return (
                            <SinglePipeline
                                key={index + 1}
                                process={process}
                                number={index + 1}
                            />
                        )
                    })}
                </AllProcessesLayout>
            )}
        </>
    )
}

export default App

const AllProcessesLayout = styled.div`
    padding: 0px;
`
