import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from "react-icons/ai"
import { BiChevronDown } from "react-icons/bi"
import { BsPen, BsArrowLeft } from "react-icons/bs"
import Popular from './Popular'
import { CgArrowsExchangeAltV } from "react-icons/cg"
import { FaCalculator, FaRegStar, FaSleigh } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FiShare } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import SwiperCore, { EffectCoverflow } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import 'swiper/swiper-bundle.css';
import 'swiper/components/effect-coverflow/effect-coverflow.min.css';
SwiperCore.use([EffectCoverflow]);
import database from './firebase'
import toast, { Toaster } from 'react-hot-toast'   //installed react-hot-toast for toast
import { useNavigate } from 'react-router-dom'
import Paragraph from './Paragraph'


// const List = ref(database, 'List')

const cat = ref(database, 'Category')

let initialCategories = ['FIGMA', 'FOOD', 'ENGINEERING', 'CINEMA', 'JOURNALISM']

export default function Story() {
  const [swiper, setSwiper] = useState(null);
  const [isLiked, setIsliked] = useState(false)
  const [subject, setSubject] = useState('')
  const [shareModal, setShareModal] = useState(false)
  const [describe, setDescribe] = useState('')
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [favourites, setFavourites] = useState([]);
  const [urlCat, setUrlCat] = useState('')
  const [search, setSearch] = useState('')
  const [searchResults2, setSearchResults2] = useState([])

  const [categories, setCategories] = useState([])
  const [newCat, setNewCat] = useState([])
  const [randomCat, setRandom] = useState([])
  const [mappable, setMappable] = useState([])

  const [show, setShow] = useState(false)
  const [show3, setShow3] = useState(false)
  const [show4, setShow4] = useState(false)
  const [menu, setMenu] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [content, setContent] = useState(false)

  const [check, setCheck] = useState('')
  const [selectedValue, setSelectedValue] = useState('')

  const [stories, setStories] = useState(0)
  const [expandedSections, setExpandedSections] = useState({})
  const [reveal, setReveal] = useState({})

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    onValue(cat, function (snapshot) {
      if (snapshot.exists()) {
        const entries = Object.entries(snapshot.val())
        setCategories(entries.map(item => item[1]))
        setNewCat(entries.map(item => item[1]))
        setRandom(entries.map(item => item[1]))
      }
    })
  }, [])
  useEffect(() => {
    if (randomCat.length > 0) {
      const random = Math.floor((Math.random() * categories.length))
      setCheck(randomCat[random])
    }
  }, [randomCat])


  function getCurrentDateTime() {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0')
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const year = String(now.getFullYear())
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`
  }

  function handleValue(e) {
    const name = e.target.name
    const value = e.target.value

    if (name === 'subject') {
      setSubject(value)
    }

    else if (name === 'description') {
      setDescribe(value)
    }
  }

  function handleSearch(e) {
    const searchValue = e.target.value
    setSearchText(searchValue)

    const results = performSearch(searchValue)
    setSearchResults(results)


  }

  function handleSearch2(e) {
    setSearch(e.target.value)
    setMenu(false)
    setShow3(true)

    const results = performSearch2(e.target.value)
    setSearchResults2(results)
  }

  function handleCategorySelect(category) {
    setSelectedCategory(category.toUpperCase())
    setSearchText('')
    setSearchResults([])
    setShow(false)
  }

  function handleCategorySelect2(category) {
    setSelectedValue('')
    setSearch(category)
    setSearchResults2([])
    searchBar(category)
  }
  function performSearch(searchValue) {
    const filteredCategories = categories && categories.filter(category =>
      category.toLowerCase().startsWith(searchValue.toLowerCase()))

    return filteredCategories
  }

  function performSearch2(searchValue) {
    const filteredCategories = randomCat && randomCat.filter(category =>
      category.toLowerCase().startsWith(searchValue.toLowerCase()))

    return filteredCategories
  }

  function clear() {
    setSubject('')
    setDescribe('')
    setSearchText('')
    setSelectedCategory('')
  }

  function handleSubmit(e) {
    const random = ((Math.random() * 4))
    e.preventDefault()
    const Data = {
      subject: subject,
      description: describe,
      category: selectedCategory,
      timeStamp: getCurrentDateTime(),
      id: random
    }
    // wrapped the submit event in try catch block for error handling
    try {

      if (subject && describe && selectedCategory) {
        push(ref(database, `List/${selectedCategory}`), Data)

        if (selectedCategory) {
          if (newCat && !newCat.some((item) => (item.toLowerCase() === selectedCategory.toLowerCase()))) {
            push(cat, selectedCategory)
          }
          clear()
        }
        toast.success("story Published!")      //toast on successfull publishing
      }
      else {
        toast.error("Please Enter all the details")
      }
    }
    catch (err) {
      toast.error("Something Went Wrong!")   //toast the error if encountered
    }
  }

  function handleShow() {
    setShow(prev => !prev)
  }

  function handleAdd() {
    setSelectedCategory(searchText.toUpperCase())
    setSearchText('')
    setSearchResults([])
    setShow(false)

    if (searchText) {
      if (initialCategories && !initialCategories.some((item) => (item.toLowerCase() === searchText.toLowerCase()))) {
        setCategories((prevCategories) => [...prevCategories, searchText])
        initialCategories.push(searchText)
      }
    }
  }

  function searchBar(cat) {
    cat && setMenu(true)
    setShow3(false)
    setShow4(false)
  }



  function handleClick() {
    setShow3(prev => !prev)
    setShow4(false)
  }

  function handleClick2() {
    setShow4(prev => !prev)
    setShow3(false)
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    windowWidth > 425 ? setContent(true) : setContent(false)
  }, [windowWidth])

  function handleflip() {
    setFlipped(prev => !prev)
  }


  function handleChildValue(value) {
    setSelectedValue(value)
    setSearch('')
    navigate(`/allstories/${value}`)    // onclick on any of the popular or favourate tabs the user will be directed to the dedicated all stories page
  }


  useEffect(() => {
    var cat = mappable.length === 0 ? selectedValue == "" ? search : selectedValue : mappable[0][1].category;
    setUrlCat(cat);
  }, [mappable, selectedValue])

  function formattedDate2(dateTimeString) {
    const dateTimeParts = dateTimeString.split('-')

    const day = dateTimeParts[0]
    const month = dateTimeParts[1]
    const year = dateTimeParts[2]

    return `${month}-${day}-${year}`

  }

  function formattedTime(dateTimeString) {
    const dateTimeParts = dateTimeString.split('-')

    const hours = dateTimeParts[3]
    const minutes = dateTimeParts[4]
    const seconds = dateTimeParts[5]

    return `${hours}-${minutes}-${seconds}`

  }

  useEffect(() => {
    if (windowWidth > 425) {
      setReveal({})
    }

    else if (windowWidth <= 425) {
      setShow4(false)
      setShow(false)
    }
  }, [windowWidth])



  useEffect(() => {
    if (selectedValue) {
      onValue(ref(database, `List/${selectedValue.toUpperCase()}`), function (snapshot) {
        if (snapshot.exists()) {
          setStories(Object.entries(snapshot.val()).length)
          setMappable(Object.entries(snapshot.val()))
        }
        else {                            //conditon ..if no story is available
          setMappable([]);
          setStories(0)
        }
      })
    }
    setReveal({})

  }, [selectedValue])

  useEffect(() => {                                   //initially retrieve the favourites from the local storage.
    var arr = localStorage.getItem('categories')
    if (arr) {
      arr = JSON.parse(arr)
      setFavourites(arr)
    }
  }, [])

  useEffect(() => {
    // Set isLiked to false initially
    setIsliked(false);

    // Get the category to check
    const categoryToCheck = mappable.length === 0 ? selectedValue == "" ? search : selectedValue : mappable[0][1].category;

    // Check if the category is among favorites
    var fav = favourites.map((fav) => fav.category)
    const isCategoryLiked = fav.includes(categoryToCheck);

    // Update isLiked state
    setIsliked(isCategoryLiked);
  }, [search, selectedValue, mappable, favourites]);


  useEffect(() => {
    if (check) {
      onValue(ref(database, `List/${check.toUpperCase()}`), function (snapshot) {
        if (snapshot.exists()) {
          setStories(Object.entries(snapshot.val()).length)
          setMappable(Object.entries(snapshot.val()))
        }
        else {                    //conditon ..if no story is available
          setMappable([])
          setStories(0)

        }
      })
    }

    setReveal({})

  }, [check])

  // handle the outside clicks for drop down

  useEffect(() => {
    // Function to close the dropdown when clicking outside
    function handleClickOutside(event) {
      if ((dropdownRef.current && !dropdownRef.current.contains(event.target))) {
        setShow3(false);
        setShow4(false);
      }
    }

    // Bind the event listener
    document.addEventListener('click', handleClickOutside);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    if (search) {
      onValue(ref(database, `List/${search.toUpperCase()}`), function (snapshot) {
        if (snapshot.exists()) {
          setStories(Object.entries(snapshot.val()).length)
          setMappable(Object.entries(snapshot.val()))
        }
        else {                //conditon ..if no story is available
          setMappable([])
          setStories(0)
        }
      })
    }
    setReveal({})
  }, [search])

  function showContent() {
    setContent(prev => !prev)
  }

  function handleAddLike() {                                    // add favourites to local storage
    //getting the current category
    var fav = urlCat
    const story = mappable.length
    var catt = {
      category: fav,
      stories: story
    }
    var favarr = []
    if (!isLiked) {                                               //if not liked already then add
      favarr = favourites
      favarr.push(catt)
      setFavourites(favarr)                                        //set the category as new favourite
      toast.success(`${fav} added to your favourites`)
    }
    else {                                                      //if already liked then remove it
      favarr = JSON.parse(localStorage.getItem('categories'))
      favarr = favarr.filter((favs) => favs.category != fav)    //filter out the category that has to be removed from the favourites
      setFavourites(favarr)
      toast.success(`${fav} removed from your favourites`)

    }
    localStorage.setItem('categories', JSON.stringify(favarr))
    setIsliked(!isLiked)                                             //changes liked -> not liked && not liked -> liked
  }

  // open modal for share
  function handleShare() {
    setShareModal(true)
  }


  // handle copy to clipboard logic
  const handleCopy = () => {
    var text = `${window.location.href}allstories/${urlCat}`
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch((error) => {
        toast.error('Failed to copy link');
      });
  };

  function sorted(mappable) {
    const sortedMappable = mappable.sort((a, b) => {
      const dateA = new Date(formattedDate2(Object.values(a[1])[4]))
      const dateB = new Date(formattedDate2(Object.values(b[1])[4]))

      if (dateA < dateB) {
        return flipped ? 1 : -1
      }

      if (dateA > dateB) {
        return flipped ? -1 : 1;
      }

      const timeA = formattedTime(Object.values(a[1])[4]);
      const timeB = formattedTime(Object.values(b[1])[4]);

      if (timeA < timeB) {
        return flipped ? 1 : -1;
      }
      if (timeA > timeB) {
        return flipped ? -1 : 1;
      }
    })

    return sortedMappable.map((items, index) => {
      const random = ((Math.random() * 4))
      return (
        <div key={random} className='single-items'>
          <Paragraph item={items[1]} />
        </div>
      )
    })
  }

  return (
    <>
      {/* Toaster for toast on successfull publishing of stories or if any error encountered */}
      <Toaster toastOptions={{

        style: {
          border: '2px solid #6c5125',
          borderRadius: 0
        }
      }} />
      <div className='flex'>
        <Popular onChildValue={handleChildValue} favourites={favourites} />
        <div className='story-section'>

          <form className='section-1' >
            <div className='section-1-head'>
              <h1>Write your own story</h1>
              <BsPen className='pen' onClick={showContent} />
            </div>
            {content && <div className='section-1-content' >
              <div className="subject">
                <label htmlFor="subject"><h3>Topic</h3></label>
                <input id="subject"
                  name="subject"
                  type='text'
                  placeholder='write the topic for your story '
                  value={subject}
                  onChange={(e) => handleValue(e)} required />
              </div>

              <div className="description">
                <label htmlFor="describe"><h3>Description</h3></label>
                <textarea
                  value={describe}
                  name='description'
                  id='describe'
                  placeholder='write what your story is about here'
                  onChange={(e) => handleValue(e)} required />
              </div>

              <div className='selectCategory'>

                <div className='select-btn' onClick={handleShow}>
                  {selectedCategory ? <span>{selectedCategory.toUpperCase()}</span> :
                    <span>Select a category</span>}
                  <BiChevronDown className='down' />
                </div>

                {show && <div className='content' >
                  <div className='search'>
                    <AiOutlineSearch className='search-btn' />
                    <input
                      type="text"
                      id='category'
                      placeholder="Search"
                      value={searchText}
                      onChange={handleSearch} required />
                  </div>


                  {searchText.length === 0 ?
                    (<ul className='search-list'>
                      {initialCategories.map(category => (
                        <li key={category} onClick={() => handleCategorySelect(category)}>
                          {category}
                        </li>
                      ))}
                    </ul>) :
                    searchResults.length > 0 ? (
                      <ul className='search-list'>
                        {searchResults.map(category => (
                          <li key={category} onClick={() => handleCategorySelect(category)}>
                            {category}
                          </li>
                        ))}
                      </ul>
                    ) :
                      <ul className='search-list'>
                        <li onClick={handleAdd}>Add new category</li>
                      </ul>}

                </div>}
              </div>

              <button type='submit' className='submit-btn' onClick={handleSubmit}>
                PUBLISH YOUR STORY
              </button>
            </div>}
          </form>

          <div className='middle-line' />

          <section className='section-2'>

            <div className='section-2-head'>
              {/* Read stories on selectedValue from popular, else mappable values from the dropdown */}
              <h1>Read stories on <a href={`/allstories/${urlCat}`}><FaExternalLinkAlt size={windowWidth > 715 ? 20 : 15} /></a> <br /> {urlCat} </h1>
              {/*adding ref to close on click outside  */}
              <div className='looking' ref={dropdownRef}>
                <div className='choose'>
                  <label htmlFor='choose'><h3>What are you looking for?</h3></label>
                  <input
                    type="text"
                    id='choose'
                    placeholder="Browse a Category"
                    value={search}
                    onClick={handleClick}
                    onChange={handleSearch2} required />
                  <BiChevronDown className='btn-2' onClick={handleClick2} />
                </div>
                {(show4) ? (
                  <ul className='search-list search-list-2' >
                    {initialCategories.map(category => (
                      <li key={category} onClick={() => handleCategorySelect2(category)}>
                        {category}
                      </li>
                    ))}
                  </ul>
                ) :
                  (show3 && search.length === 0) ? (
                    <ul className='search-list search-list-2' >
                      {initialCategories.map(category => (
                        <li key={category} onClick={() => handleCategorySelect2(category)}>
                          {category}
                        </li>
                      ))}
                    </ul>
                  ) :
                    ((show3 && searchResults2.length > 0)) && (
                      <ul className='search-list search-list-2' >
                        {searchResults2.map(category => (
                          <li key={category} onClick={() => handleCategorySelect2(category)}>
                            {category}
                          </li>
                        ))}
                      </ul>
                    )}
              </div>
            </div>

            <div className='filter'>
              <h1 className='total-story'><span>{stories === 1 ? `${stories} story` : stories === 0 ? `0 story` : `${stories} stories`}</span> for you to read</h1>
              <div className='flex-filter'>

                {/* added the star feature */}
                <button className='star-button' onClick={handleShare}><FiShare size={windowWidth > 625 ? 30 : 20} color='#6B5023' /></button>
                <button className='star-button' onClick={handleAddLike}>
                  {
                    isLiked ?
                      <FaStar size={windowWidth > 625 ? 30 : 20} color='#FFD700' />
                      :
                      <FaRegStar size={windowWidth > 625 ? 30 : 20} color='#6B5023' />
                  }
                </button>
                <h2 className='filter-heading'>Sort:
                  <span onClick={handleflip}>
                    {flipped ? `Newest to Oldest` : `Oldest to Newest`}
                  </span>
                </h2>
                <CgArrowsExchangeAltV className='filterarrow' onClick={handleflip} />
              </div>
            </div>
            {stories === 0 ? <span style={{
              fontFamily: 'var(--ff-gilroy)',
              fontSize: '1.25rem',
              color: 'rgba(0, 0, 0, 0.75)',
              fontWeight: '500',
            }}>No Stories Found!!</span> :             // if no stories are there then no story will be displayed
              windowWidth > 425 ? <div style={{ width: '100%' }}>
                {selectedValue && (
                  <div className='container'>
                    <section className='item-section-main'>
                      <div className='item-section-container'>
                        {(check && mappable) && sorted(mappable)}
                      </div>
                    </section>
                  </div>
                )}

                {(!menu || search.length === 0) && (<div className='container'>
                  <section className='item-section-main'>
                    <div className='item-section-container'>
                      {(check && mappable) && sorted(mappable)}
                    </div>
                  </section>
                </div>)
                }

                {(search.length > 0 && menu) && (<div className='container'>
                  <section className='item-section-main'>
                    <div className='item-section-container'>
                      {sorted(mappable)}
                    </div>
                  </section>
                </div>)
                }
              </div>
                :
                (<div className='container'>
                  <section className='item-section-main'>
                    <Swiper
                      effect="coverflow"
                      // grabCursor='true'
                      centeredSlides='true'
                      slidesPerView={3}
                      coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 200,
                        modifier: 1,
                        slideShadows: false,
                      }}
                    // onSwiper={handleSwiperInit}
                    // onSlideChange={handleSlideChange}
                    >
                      <div className='swiper-wrapper'>
                        {(() => {
                          const sortedMappable = mappable.sort((a, b) => {
                            const dateA = new Date(formattedDate2(Object.values(a[1])[4]))
                            const dateB = new Date(formattedDate2(Object.values(b[1])[4]))

                            if (dateA < dateB) {
                              return flipped ? 1 : -1
                            }

                            if (dateA > dateB) {
                              return flipped ? -1 : 1;
                            }

                            const timeA = formattedTime(Object.values(a[1])[4]);
                            const timeB = formattedTime(Object.values(b[1])[4]);

                            if (timeA < timeB) {
                              return flipped ? 1 : -1;
                            }
                            if (timeA > timeB) {
                              return flipped ? -1 : 1;
                            }
                          })

                          return sortedMappable.map((items, index) => {
                            const random = ((Math.random() * 4))
                            return (
                              <SwiperSlide key={random} className='swiper-slide'>
                                {/* made paragraph a component so that it can be used anywhere else */}
                                <Paragraph item={items[1]} />
                              </SwiperSlide>
                            )
                          })
                        })()}
                      </div>
                    </Swiper>
                  </section>
                </div>)}
          </section>
        </div>
      </div >
      {
        shareModal && <div className="overlay" >
          <div className="modal" ref={modalRef}>
            <div className="link-cont">
              <h2>Share your favourate stories</h2>
              <span>
                <a>{`${window.location.href}allstories/${urlCat}`}</a>
              </span>
            </div>
            <div className="buttons">
              <button onClick={handleCopy}>COPY LINK</button>
              <button onClick={() => setShareModal(false)}>CLOSE</button>
            </div>
          </div>
        </div>}
    </>
  )
}
