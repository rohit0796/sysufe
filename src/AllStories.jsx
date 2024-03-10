import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import database from './firebase'
import Paragraph from './Paragraph'
const AllStories = () => {

    const { category } = useParams()     //fetching the category from the url
    const [stories, setStories] = useState([])

    // fetching the stories from the data base for each category
    const getStories = () => {
        onValue(ref(database, `List/${category}`), function (snapshot) {
            if (snapshot.exists()) {
                const entries = Object.entries(snapshot.val())
                setStories(entries.map((story) => story[1]))
            }
        })
    }

    useEffect(() => {
        getStories()
    }, [])

    return (
        <div >
            <div className="section-2-head">
                <h1>Read stories from {category}</h1>
            </div>
            {
                stories.length == 0 ?
                    <h3>No Stories Yet</h3>
                    :
                    stories.map((story) => {
                        const random = ((Math.random() * 4))
                        return (
                            <div key={random} className='single-items'>
                                <Paragraph item={story} />
                            </div>
                        )
                    })
            }
        </div>
    )
}

export default AllStories
