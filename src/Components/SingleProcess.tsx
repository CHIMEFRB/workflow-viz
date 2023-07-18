import { Process } from '../App'
import { styled } from 'styled-components'

interface SingleProcessProps {
    number: number
    process: Process
}

interface StageProps {
    evaluate_on_runtime: boolean
    if_condition: string
    matrix: object
    name: string
    reason: null
    stage: number
    status: keyof typeof Status
    success_threshold: number
    work: object
    work_id: string
    [key: string]: any
}

enum Status {
    cancelled = '🚫', // 0
    failure = '😵', // 1
    running = '🏃‍♀️', // 2
    queued = '🕓', // 3
    success = '✅', // 4
    created = '🐣', // 5
}

const SingleProcess: React.FC<SingleProcessProps> = ({ number, process }) => {
    const stageIndices: {
        [key: string]: {
            name: string
            index: number
            count: number
            status: keyof typeof Status
            renderArray?: object[]
        }
    } = {}
    const stageOrder: string[] = []
    let lastStageName = ''

    ;(process.pipeline as StageProps[]).map((stage: StageProps, index) => {
        if (stage.name !== lastStageName) {
            stageOrder.push(stage.name)

            stageIndices[stage.name] = {
                name: stage.name,
                index: index,
                count: 1,
                status: stage.status,
            }

            const lastStageObj = stageIndices[lastStageName]
            lastStageName = stage.name
            if (lastStageObj?.count > 1) {
                lastStageObj.renderArray = process.pipeline.slice(
                    lastStageObj.index,
                    lastStageObj.index + lastStageObj.count
                )
            }
        } else {
            stageIndices[stage.name].count = stageIndices[stage.name].count + 1
        }
    })
    console.log(stageIndices, 'INDIXIES')
    return (
        <ProcessContainer>
            <ProcessTitle>
                <StyledP>Process # {number}</StyledP>
                <StyledP>Current Stage: {process.current_stage}</StyledP>
            </ProcessTitle>
            <StagesDiv>
                {stageOrder.map((stageName: string, index) => {
                    return (
                        <SingleStageDiv key={stageName}>
                            <StageNumAndCount>
                                <StyledP>Stage #{index + 1}</StyledP>
                                {stageIndices[stageName].count > 1 ? (
                                    <StyledP>
                                        Count: {stageIndices[stageName].count}
                                    </StyledP>
                                ) : (
                                    ''
                                )}
                            </StageNumAndCount>
                            {/* render multiple stages if count > 1 */}
                            {stageIndices[stageName].count > 1 ? (
                                // what am i mapping?
                                // want each iteration of a given stage #
                                // access pipeline array at given index
                                (
                                    stageIndices[stageName]
                                        .renderArray as StageProps[]
                                )?.map((stage: StageProps, index) => {
                                    return (
                                        <StageRepeatDiv
                                            key={`${number},${index}`}
                                        >
                                            <StyledP>
                                                Name: {stage.name}
                                            </StyledP>
                                            <StyledP>{index + 1} / 64 </StyledP>
                                            <StyledP>
                                                Status: {Status[stage.status]}
                                            </StyledP>
                                        </StageRepeatDiv>
                                    )
                                })
                            ) : (
                                <StageRepeatDiv>
                                    <StyledP>
                                        Name: {stageIndices[stageName].name}
                                    </StyledP>
                                    <StyledP>
                                        Status:{' '}
                                        {Status[stageIndices[stageName].status]}
                                    </StyledP>
                                </StageRepeatDiv>
                            )}
                        </SingleStageDiv>
                    )
                })}
            </StagesDiv>
        </ProcessContainer>
    )
}

export default SingleProcess

const ProcessContainer = styled.div`
    &:not(:first-child) {
        border-top: 4px dotted grey;
        margin: 40px 0px;
    }
`

const ProcessTitle = styled.div`
    margin: 10px;
    justify-content: space-around;
    display: flex;
`

const StagesDiv = styled.div`
    display: flex;
    border: 1px solid grey;
    padding: 10px;
    margin: 10px;
    height: 180px;
    overflow-x: auto;
    overflow-y: scroll;
    white-space: nowrap;

    div:not(:first-child) {
        /* border-left: 2px solid grey; */
    }
`
const SingleStageDiv = styled.div`
    flex: 1 0 250px;

    margin: 0px 15px;
`
const StageNumAndCount = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 25px;
`
const StageRepeatDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    border: 2px solid grey;
    border-radius: 5px;
    height: 100px;
    margin-bottom: 5px;
`
const StyledP = styled.p`
    margin-block-end: 0px;
    margin-block-start: 0px;
`
