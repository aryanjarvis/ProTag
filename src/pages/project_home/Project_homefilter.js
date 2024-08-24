import { useState } from 'react'

const filterList = ['all', 'Sales', 'Engineering', 'Trading', 'LifeHacks', 'Management', 'OutOfBox']

export default function ProjectHomeFilter({changeFilter}) {

    const [currentFilter, setCurrentFilter] = useState('all')

    const handleClick = (newFilter) => {
        setCurrentFilter(newFilter)
        changeFilter(newFilter)
    }

    return (
        <div className="project-filter">
        <nav>
          <p>Filter by: </p>
          {filterList.map((f) => (
            <button key={f}
              onClick={() => handleClick(f)}
              className={currentFilter === f ? 'active' : ''}
            >{f}</button>
          ))}
        </nav>
      </div>
    )
}

