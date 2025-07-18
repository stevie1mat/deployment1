'use client';

const team = [
  {
    name: 'Jerome Bell',
    role: 'Marketing Coordinator',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  {
    name: 'Theresa Webb',
    role: 'Nursing Assistant',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    name: 'Cameron Williamson',
    role: 'Dog Trainer',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Cody Fisher',
    role: 'Medical Assistant',
    image: 'https://randomuser.me/api/portraits/men/36.jpg',
  },
  {
    name: 'Dianne Russell',
    role: 'Web Designer',
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
];

export default function OurTeamSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold">Our Team</h2>
          <p className="text-gray-500 text-sm">Meet the people behind TradeMinutes</p>
        </div>

        {/* Placeholder slider dots and arrows */}
        <div className="flex items-center gap-3">
          <button className="text-xl hover:text-gray-700">←</button>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-900 rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
          <button className="text-xl hover:text-gray-700">→</button>
        </div>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {team.map((member, idx) => (
          <div key={idx} className="text-center">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-64 object-cover rounded-xl shadow-sm"
            />
            <h4 className="font-semibold mt-3">{member.name}</h4>
            <p className="text-sm text-gray-500">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
