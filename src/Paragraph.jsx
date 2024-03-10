import React, { useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'

function Paragraph({ item }) {
    const [expandedSections, setExpandedSections] = useState({})
    const [reveal, setReveal] = useState({})
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    function formattedDate(dateTimeString) {
        const dateTimeParts = dateTimeString.split('-')

        const day = dateTimeParts[0]
        const month = dateTimeParts[1]
        const year = dateTimeParts[2]

        return `${day}-${month}-${year}`

    }

    const revealMain = {
        position: 'relative',
        right: '75px',
        width: windowWidth > 320 ? '283px' : '250px',
        height: '357px',
        boxShadow: '1px 1px 0px #000000',
    }

    const revealhead = {
        alignSelf: 'center',
        width: '194px',
        marginBottom: '8px',
    }

    const revealPara = {
        marginTop: 'initial',
        width: '215px',
        overflowY: reveal ? 'auto' : 'hidden',
        maxHeight: '192px',
        fontSize: '0.725rem'
    }

    function goback() {
        setReveal({})
    }

    function togglePara(itemId) {
        windowWidth > 425 ?
            (setExpandedSections((prevExpandedSections) => ({
                ...prevExpandedSections,
                [itemId]: !prevExpandedSections[itemId],
            }))) :

            (setReveal((prevReveal) => ({
                ...prevReveal,
                [itemId]: !prevReveal[itemId],
            })))
    }

    if (item) {
        item = Object.values(item)
        const words = item[1].split(' ')
        const isExpanded = expandedSections[item[2]]
        const isRevealed = reveal[item[2]]

        if (words.length > 24 && !isExpanded) {
            return (
                <div className='item-section' key={item[2]} style={isRevealed ? revealMain : {}}>
                    <div className='item-category'>
                        <h3>{item[0]}</h3>
                        <p>{formattedDate(item[4])}</p>
                    </div>
                    {isRevealed && <BsArrowLeft className='left-arrow' onClick={goback} />}
                    <h2 style={isRevealed ? revealhead : {}}>{item[3]}</h2>
                    <div className='show-para'>
                        {isRevealed ? <p style={isRevealed ? revealPara : {}}>{item[1].slice(0, item[1].length)}...</p> :
                            <p>{item[1].slice(0, 154)}...</p>}
                    </div>
                    {windowWidth > 425 ? <span className='read-more' onClick={() => togglePara([item[2]])}>
                        Read more...
                    </span> :
                        !isRevealed && <span className='read-more' onClick={() => togglePara([item[2]])}>
                            Read more...
                        </span>}
                </div>
            )
        }

        else {
            return (
                <div className='item-section' key={item[2]} style={isRevealed ? revealMain : {}}>
                    <div className='item-category'>
                        <h3>{item[0]}</h3>
                        <p>{formattedDate(item[4])}</p>
                    </div>
                    {isRevealed && <BsArrowLeft className='left-arrow' onClick={goback} />}
                    <h2 style={isRevealed ? revealhead : {}}>{item[3]}</h2>
                    <div className='show-para'>
                        <p style={isRevealed ? revealPara : {}}>{item[1]}</p>
                    </div>
                    {words.length > 24 && windowWidth > 425 ? (
                        <span className='read-more' onClick={() => togglePara(item[2])}>
                            Read less
                        </span>
                    ) :

                        (words.length > 24 && !isRevealed) && <span className='read-more' onClick={() => togglePara(item[2])}>
                            Read more...
                        </span>}
                </div>
            )
        }
    }
}

export default Paragraph
