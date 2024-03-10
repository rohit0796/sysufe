import React from 'react'

export default function Popular({ onChildValue, favourites }) {

  var localfav = favourites.sort((a, b) => b.stories - a.stories) // sorting the favourites based on number of stories

  var populars = ["ENGINEERING DAYS", "BANGALORE STORIES", "GOA DIARIES", "NITK STUFFS", "IIM THINGS", "IIMB FACTS", "SHAYARI", "VIKAS MEENA"]
  localfav = localfav.map((fav) => fav.category)
  console.log(localfav)
  populars = localfav.concat(populars).slice(0, 10)   //concating the favourites with populars and displaying only 10 popular tabs
  
  
  function ListItem({ value }) {
    const handleClick = () => {
      onChildValue(value)
    }

    return <li onClick={handleClick}>{value}</li>
  }

  return (
    <div className='popular'>
      {/* changing the heading to favourites as soon as user add something to favourites */}
      <h1>{favourites.length == 0 ? "What's popular right now?" : "Here are some of Your Favourites"}</h1>

      <div className='list'>
        <ul className='list-items'>
          {
            populars.map((pop) => {
              const key = ((Math.random() * 4))
              return <ListItem value={pop} key={key} />
            }
            )
          }

        </ul>
      </div>
    </div>
  )
}
