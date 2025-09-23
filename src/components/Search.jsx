import React from 'react'

const search = ({searchTerm, setsearchTerm}) => {
  return (
    <div className="search">
        <div>
            <img src ="search.svg" atl ="search"/>

            <input 
                type ="text"
                placeholder="Search Through Thousands of Movies"
                value = {searchTerm}
                onChange={(e) => setsearchTerm(e.target.value)}
            />
        </div>
    </div>
  )
}

export default search