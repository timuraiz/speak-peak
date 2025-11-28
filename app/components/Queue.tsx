import React from 'react';
import Image from 'next/image';

export default function Queue() {
    return <div className='flex items-center gap-2'>
        <Image src="/face1.png" alt="Face 1" width={24} height={24} className="object-contain rounded-full border-0.25 border-white" quality={100} />
        <Image src="/face2.png" alt="Face 2" width={24} height={24} className="object-contain rounded-full border-0.25 border-white -ml-4 z-10" quality={100} />
        <Image src="/face3.png" alt="Face 3" width={24} height={24} className="object-contain rounded-full border-0.25 border-white -ml-4 z-20" quality={100} />
        <span className="text-xs text-dark-50"><span className="text-xs text-dark">47</span> people in queue</span>
    </div>
}