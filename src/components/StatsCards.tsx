import { MapPin, Users, TreeDeciduous } from 'lucide-react';

interface StatsCardsProps {
  treeCount: number;
}

const StatsCards = ({ treeCount }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all">
        <TreeDeciduous className="mx-auto mb-3 text-green-600" size={48} />
        <p className="text-4xl font-bold text-green-600">{treeCount}</p>
        <p className="text-gray-600 font-medium">Trees Planted</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all">
        <Users className="mx-auto mb-3 text-blue-600" size={48} />
        <p className="text-4xl font-bold text-blue-600">{treeCount}</p>
        <p className="text-gray-600 font-medium">Participants</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all">
        <MapPin className="mx-auto mb-3 text-orange-600" size={48} />
        <p className="text-4xl font-bold text-orange-600">All Wilayas</p>
        <p className="text-gray-600 font-medium">Locations Covered</p>
      </div>
    </div>
  );
};

export default StatsCards;
