'user client';
import React from 'react'
import Image from 'next/image';

const Share = () => {
  return (
    <div>
        <button>
            <Image src='/images/share.png' alt='share' width={15} height={15}></Image>
        </button>
    </div>
  )
}

export default Share