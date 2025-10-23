import { TreeDeciduous } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8 px-4 shadow-2xl">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-3">
          <TreeDeciduous size={48} />
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Algeria Tree Planting Campaign
          </h1>
        </div>
        <p className="text-center text-xl text-green-100 mb-2">October 25, 2025 - National Arbor Day</p>
        <p className="text-center text-lg text-white/90 max-w-3xl mx-auto">
          Join thousands of Algerians in planting trees across our beautiful nation. Together, we are building a greener future!
        </p>
      </div>
    </header>
  );
};

export default Header;
