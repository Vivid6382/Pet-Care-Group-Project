'user client';
import React from 'react'
import Image from 'next/image';

const Dislike = () => {
  return (
    <div>
        <button>
            <Image src='/images/dislike.png' alt='dislike' width={15} height={15}></Image>
        </button>
    </div>
  )
}

export default Dislike