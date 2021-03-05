import React from 'react'
import {WheelComponent} from '../components/WheelComponent'
import '../styles/home.css'

const Home = () => {
    const segments = [
        'Tao', 'Buoi', 'Chanh', 'Dua', 'Cam', 'Tac', 'Du Du', 'Sau Rieng'
    ]
    const segColors = [
        '#EE4040',
        '#F0CF50',
        '#815CD1',
        '#3DA5E0',
        '#34A24F',
        '#F9AA1F',
        '#EC3F3F',
        '#FF9000'
    ]
    const onFinished = (winner) => {
        console.log(winner)
    }

    return (
        <React.Fragment>
            <div className='wrapper'>
                <div className='divide-part2'>

                </div>
                <div className='divide-part'>
                    <WheelComponent
                        segments={segments}
                        segColors={segColors}
                        // winningSegment={segments[3]}
                        onFinished={(winner) => onFinished(winner)}
                        primaryColor='black'
                        contrastColor='white'
                        buttonText='Spin'
                        isOnlyOnce = {true}
                    />
                </div>
                <div className='divide-part2'>

                </div>
            </div>
        </React.Fragment>
  )
}

export {Home}