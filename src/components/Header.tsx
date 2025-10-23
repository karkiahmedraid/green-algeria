import { TreeDeciduous } from 'lucide-react';

interface HeaderProps {
  treesCount: number;
}

const Header = ({ treesCount }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8 px-4 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <TreeDeciduous size={48} className="animate-bounce" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Algeria Tree Planting Campaign
              </h1>
              <p className="text-green-100 text-sm md:text-base">October 25, 2025 - National Arbor Day</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border-2 border-white/20">
            <div className="text-center">
              <p className="text-5xl font-bold text-white mb-1">{treesCount.toLocaleString()}</p>
              <p className="text-green-100 font-semibold text-sm uppercase tracking-wide">Trees Planted</p>
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
