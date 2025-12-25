
import Link from 'next/link';

interface CommonButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const CommonLink = ({ href, children, className = "" }: CommonButtonProps) => {
  return (
    <Link 
      href={href}
      className={`
        block text-center p-3 text-black bg-white 
        border-4 border-white rounded-full cursor-pointer 
        text-xl font-bold transition-all duration-200 ease-in-out 
        box-border no-underline
        hover:bg-white hover:text-black hover:border-black
        ${className}
      `}
    >
      {children}
    </Link>
  );
};

export default CommonLink;