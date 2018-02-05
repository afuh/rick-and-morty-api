import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Link from "gatsby-link"

import index from '../../data/docs-index.yaml'

const ListLink = ({ to, children }) => (
  <li style={{ display: 'inline-block', width: '100%', margin: "0 1rem " }}>
    <Link to={to} style={{color: "#444"}}>
      {children}
    </Link>
  </li>
)

ListLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
}

const SectionLinks = ({ items }) => (
  <ul style={{ padding: 0, margin: 0, }}>
    {items.map(item => (
      <ListLink to={item.link} key={item.title}>{item.title}</ListLink>
    ))}
  </ul>
)

SectionLinks.propTypes = {
  items: PropTypes.array.isRequired,
}

const Section = ({ title, items }) => (
  <div style={{ marginBottom: "2rem" }}>
    <h3 style={{ margin: '0 0 0.2rem' }}>
      {title}
    </h3>
    <SectionLinks items={items} />
  </div>
)

Section.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
}


class Sidebar extends Component {
  state = {
    fixed: false,
  }
  componentDidMount(){
    const header = document.querySelector("header");
    header.style.height = '80px'
    this.header = header.offsetHeight

    setTimeout(() => {
      window.addEventListener('scroll', this.handleScroll);
      this.handleScroll();
    }, 500);

  }
  handleScroll = () => {
    if (window.scrollY  >= this.header) {
      this.setState({fixed: true})
    } else {
      this.setState({fixed: false})
    }
  }
  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleScroll);
  }
  render(){
    const { fixed } = this.state
    const pos = fixed ? {
      position: 'fixed',
      top: 0,
      marginTop: this.props.style.marginTop,
    } : {
      marginTop: this.props.style.marginTop,
      position: 'relative',
    }
    return (
      <aside style={pos} >
        {index.map(section => (
          <Section {...section} key={section.title} />
        ))}
      </aside>
    )
  }
}

Sidebar.propTypes = {
  style: PropTypes.object.isRequired,
}

export default Sidebar;
