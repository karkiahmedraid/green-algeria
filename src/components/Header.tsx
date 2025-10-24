import { TreeDeciduous } from 'lucide-react';

interface HeaderProps {
  treesCount: number;
}

const Header = ({ treesCount }: HeaderProps) => {
  return (
    <header className="flex bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8 px-4 text-center shadow-2xl" dir="rtl">
      <div className='hidden sm:flex w-32'>
        <img src="map_algeria_green.png" alt="" srcSet="" />
      </div>
      <div className="flex flex-col text-center mx-auto">
        <div className="flex items-center text-center justify-center gap-4">
          <div className="flex text-center items-center gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl text-center justify-center font-bold">
                حملة مليون شجرة 🌳
              </h1>
              <p className="text-green-100 text-sm md:text-base">25 أكتوبر 2025 - اليوم الوطني للشجرة</p>
              <p className="text-green-100 font-extrabold text-xl md:text-xl">{treesCount}/1000000</p>
            </div>
          </div>
        </div>
        
        <p className="text-center text-base md:text-lg text-white/90 max-w-3xl mx-auto mt-4">
          انضم إلى آلاف الجزائريين في غرس الأشجار عبر وطننا الجميل. معاً نبني مستقبلاً أخضر! 🇩🇿
        </p>
      </div>
      <div></div>
    </header>
  );
};

export default Header;
