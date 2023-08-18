import React from 'react';
import { useSpring, animated } from 'react-spring';

function HeaderSec(props) {
  // const MyCredentials = JSON.parse(localStorage.getItem('user'));

  const headingStyle = {
    padding: '1rem',
    fontSize: '2rem',
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    color: 'Black',
    borderRadius: '10px',
  };

  const contentAnimation = useSpring({
    from: {
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      transform: 'scale(2)',
    },
    to: {
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
      transform: 'scale(1.05)',
    },
    config: {
      tension: 300,
      friction: 10,
    },
  });

  return (
    <>
      <div className="container p-5 h-100 w-100">
        <div className="row">
          <animated.div
            className="text-center text-dark bg-light"
            style={{ ...headingStyle, ...contentAnimation }}
          >
            <div className="heading p-3" style={{ ...headingStyle }}>
              Welcome <i> <span className='text-primary'></span></i> Your ShoeSavvy.com
            </div>
          </animated.div>
        </div>
      </div>
    </>
  );
}

export default HeaderSec;
