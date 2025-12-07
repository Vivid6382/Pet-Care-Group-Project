'user client';
import React from 'react'
import Image from 'next/image';

const Like = () => {
  return (
    <div>
        <button>
            <Image src='/images/like.png' alt='like' width={15} height={15}></Image>
        </button>
    </div>
  )
}

export default Like