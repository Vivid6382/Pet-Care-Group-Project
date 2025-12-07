'user client';
import React from 'react'
import Image from 'next/image';

const Setting = () => {
  return (
    <div>
        <button>
             <Image src="/images/setting.png" alt="setting" width={15} height={15} className="mb-[1dip]" ></Image>
        </button>
    </div>
  )
}

export default Setting