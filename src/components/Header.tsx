import { TreeDeciduous } from 'lucide-react';

interface HeaderProps {
  treesCount: number;
}

const Header = ({ treesCount }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8 px-4 text-center shadow-2xl">
      <div className="max-w-7xl text-center mx-auto">
        <div className="flex items-center text-center justify-center  gap-4">
          <div className="flex text-center items-center gap-3">
           
            <div
                
            >
              <h1 className="text-3xl md:text-4xl text-center justify-center font-bold">
                One million trees campaign
              </h1>
              <p className="text-green-100 text-sm md:text-base">October 25, 2025 - National Arbor Day</p>
                <p className="text-green-100 font-extrabold text-xl md:text-xl">{treesCount}/1000000</p>
            </div>
          </div>
          

        </div>
        
        <p className="text-center text-base md:text-lg text-white/90 max-w-3xl mx-auto mt-4">
          Join thousands of Algerians in planting trees across our beautiful nation. Together, we are building a greener future!
        </p>
      </div>
    </header>
  );
};

export default Header;
