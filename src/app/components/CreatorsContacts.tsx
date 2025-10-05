"use client";

import Image from "next/image";

export default function CreatorContacts() {
  const creators = [
    {
      name: "Matías Freire",
      role: "Frontend",
      email: "mfreire@stevens.edu",
      img: "/Matias.jpg",
    },
    {
      name: "Alvaro Isquierdo",
      role: "Backend",
      email: "aizquier@stevens.edu",
      img: "/Alvaro.jpg",
    },
    {
      name: "Matthew Stein",
      role: "Backend",
      email: "mstein3@stevens.edu",
      img: "/Mattwe.jpeg",
    },
    {
      name: "Bradley Griffel",
      role: "Backend",
      email: "bgriffel@stevens.edu",
      img: "/Badboy.jpeg",
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center my-16 mx-auto max-w-6xl p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Creator Contacts
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {creators.map((creator, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-sm hover:shadow-2xl transition-all duration-300"
          >
            {/* Image */}
            <div className="w-full h-64 relative">
              <Image
                src={creator.img}
                alt={creator.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Text content */}
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {creator.name}
              </h3>
              <p className="text-gray-700 mb-2">{creator.role}</p>
              <p className="text-blue-600 hover:underline cursor-pointer">
                {creator.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}