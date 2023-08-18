import React from 'react';

function FooterSec() {
  return (
    <footer className="bg-dark text-white text-center py-4">
      <div className="container">
        <p className="m-0">
          &copy; {new Date().getFullYear()} ShoeSavvy.com All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default FooterSec;
