import * as React from 'react'
import PropTypes from 'prop-types'

interface LinkProps {
    active: boolean,
    children: Node,
    onClick: () => void
}


const Link = ({ active, children, onClick }: LinkProps) => {
    if (active) {
        return <span>{children}</span>
    }

    return (
        <a href="#" onClick={e => { e.preventDefault(); onClick() }}  >
            {children}
        </a>
    )
}

export default Link
