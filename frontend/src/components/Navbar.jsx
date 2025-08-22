import React, {useContext, useState, useEffect} from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BookOpen, Brain, BarChart3 } from "lucide-react"
import { assets } from '../assets/assets'
import { useCards } from '../context/CardContext'
// import { cn } from "../../lib/utils"

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { navigate } = useCards()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 

  return (
    <div 
    // className='w-full max-w-6xl mx-auto-20 lg:mx-auto'
    className={`fixed top-0 left-0 w-full z-50 px-50 pt-5 transition-colors duration-300 ${
        scrolled ? "bg-gray-100 shadow-md" : "bg-transparent"
      }`}
    >
        {/* <Link to='/'><img src={assets.logo} alt="" className='w-36' /></Link> */}
        
        <ul className='grid w-full grid-cols-7 mb-4 items-center text-center justify-items-center'>
        <div className="col-start-1 justify-self-start">
            <img src={assets.logo} alt="LeoLearn Logo" className="w-35" onClick={()=>navigate('/')} />
        </div>

        <li className="col-start-4">
            <NavLink to='/' className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg font-semibold tracking-wide transition-all duration-300
                ${
                    isActive
                    ? 'bg-blue-500 text-white shadow-[0_0_10px_bg-blue-600]'
                    : 'hover:bg-gray-100 shadow-[0_0_10px_bg-black]'
                }
                `
            }>
                <BookOpen className="h-4 w-4" />
                Decks
            </NavLink>
            </li>
            <li className="col-start-5">
            <NavLink to='/study' className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg font-semibold tracking-wide transition-all duration-300
                ${
                    isActive
                    ? 'bg-blue-500 text-white shadow-[0_0_10px_bg-blue-600]'
                    : 'hover:bg-gray-100 shadow-[0_0_10px_bg-black]'
                }
                `}>
                <Brain className="h-4 w-4" />
                Study
            </NavLink>
            </li>
            <li className="col-start-6">
            <NavLink to='/progress' className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg font-semibold tracking-wide transition-all duration-300
                ${
                    isActive
                    ? 'bg-blue-500 text-white shadow-[0_0_10px_bg-blue-600]'
                    : 'hover:bg-gray-100 shadow-[0_0_10px_bg-black]'
                }
                `}>
                <BarChart3 className="h-4 w-4" />
                Progress
            </NavLink>
            </li>

        </ul>

        {/* <div className='flex items-center gap-6'>
            <img onClick={searchNavigate} src={assets.search_icon} alt="" className='w-5 cursor-pointer' />
                 
            <div className='group relative'>
                <img onClick={()=> token ? null : navigate('/login')} src={assets.profile_icon} alt="" className='w-5 cursor-pointer' /> */}
                {/* Dropdown Menu */}
                {/* {token && 
                <div className='absolute dropdown-menu right-0 pt-4 hidden group-hover:block'>
                    <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                        <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                        <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                    </div>
                </div>}
            </div>
            <Link to='/cart' className='relative'>
                <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCardCount()}</p>
            </Link>
            <img onClick={()=>setVisible(true)} src={assets.menu_icon} alt="" className='w-5 cursor-pointer sm:hidden' />
        </div> */}

        {/* Sidebar menu for small screens */}
        {/* <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible? 'w-full': 'w-0'}`}>
            <div className='flex flex-col text-gray-600'>
                <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                    <img className='h-4 rotate-180' src={assets.dropdown_icon} alt=''/>
                    <p>Back</p>
                </div>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/about' >ABOUT</NavLink>
                <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/contact' >CONTACT</NavLink>

            </div>
        </div> */}
        
    </div>
  )
}

export default Navbar

