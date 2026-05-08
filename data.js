const UNITS = [
  {
    id: 1,
    name: "Unit 1: All about me",
    color: "#2196F3",
    vocab: [
      { word: "Address", meaning: "Địa chỉ", emoji: "🏠" },
      { word: "Hometown", meaning: "Quê hương", emoji: "🏘️" },
      { word: "Flat", meaning: "Căn hộ", emoji: "🏢" },
      { word: "Lane", meaning: "Ngõ nhỏ", emoji: "🛣️" }
    ],
    structures: [
      {
        title: "Hỏi về địa chỉ",
        formula: "What's your address? - It's + [Địa chỉ]",
        examples: [
          ["What's your address?", "Địa chỉ của bạn là gì?"],
          ["It's 81, Tran Hung Dao Street.", "Nó ở số 81, đường Trần Hưng Đạo."]
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Unit 2: Our homes",
    color: "#9C27B0",
    vocab: [
      { word: "Modern", meaning: "Hiện đại", emoji: "✨" },
      { word: "Crowded", meaning: "Đông đúc", emoji: "👨‍👩‍👧‍👦" },
      { word: "Quiet", meaning: "Yên tĩnh", emoji: "🤫" }
    ],
    structures: [
      {
        title: "Hỏi về quê hương",
        formula: "What's your hometown like? - It's + [Tính chất]",
        examples: [
          ["What's your hometown like?", "Quê bạn trông như thế nào?"],
          ["It's small and quiet.", "Nó nhỏ và yên tĩnh."]
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Unit 3: My foreign friends",
    color: "#4CAF50",
    vocab: [
      { word: "America", meaning: "Nước Mỹ", emoji: "🇺🇸" },
      { word: "Australia", meaning: "Nước Úc", emoji: "🇦🇺" },
      { word: "England", meaning: "Nước Anh", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
      { word: "Malaysia", meaning: "Nước Mã Lai", emoji: "🇲🇾" }
    ],
    structures: [
      {
        title: "Hỏi về quê quán của ai đó",
        formula: "Where is he/she from? - He/She is from + [Tên nước]",
        examples: [
          ["Where is she from?", "Cô ấy đến từ đâu?"],
          ["She is from Japan.", "Cô ấy đến từ Nhật Bản."]
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Unit 4: Our free-time activities",
    color: "#FF9800",
    vocab: [
      { word: "Go fishing", meaning: "Đi câu cá", emoji: "🎣" },
      { word: "Go swimming", meaning: "Đi bơi", emoji: "🏊" },
      { word: "Play chess", meaning: "Chơi cờ", emoji: "♟️" },
      { word: "Play badminton", meaning: "Chơi cầu lông", emoji: "🏸" }
    ],
    structures: [
      {
        title: "Hỏi về hoạt động lúc rảnh rỗi",
        formula: "What do you do in your free time? - I + [Hoạt động]",
        examples: [
          ["What do you do in your free time?", "Bạn làm gì vào lúc rảnh rỗi?"],
          ["I surf the Internet.", "Mình lướt mạng Internet."]
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Unit 5: My future job",
    color: "#E91E63",
    vocab: [
      { word: "Pilot", meaning: "Phi công", emoji: "👨‍✈️" },
      { word: "Doctor", meaning: "Bác sĩ", emoji: "👨‍⚕️" },
      { word: "Nurse", meaning: "Y tá", emoji: "👩‍⚕️" },
      { word: "Architect", meaning: "Kiến trúc sư", emoji: "🏗️" }
    ],
    structures: [
      {
        title: "Hỏi về nghề nghiệp tương lai",
        formula: "What would you like to be in the future? - I'd like to be a/an + [Nghề nghiệp]",
        examples: [
          ["What would you like to be in the future?", "Bạn muốn làm nghề gì trong tương lai?"],
          ["I'd like to be a teacher.", "Mình muốn trở thành giáo viên."]
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Unit 6: Our school rooms",
    color: "#795548",
    vocab: [
      { word: "Computer room", meaning: "Phòng máy tính", emoji: "💻" },
      { word: "Art room", meaning: "Phòng mỹ thuật", emoji: "🎨" },
      { word: "Gym", meaning: "Phòng tập thể dục", emoji: "🏀" },
      { word: "Library", meaning: "Thư viện", emoji: "📚" }
    ],
    structures: [
      {
        title: "Hỏi vị trí của phòng học",
        formula: "Where is the + [Tên phòng]? - It's + [Vị trí]",
        examples: [
          ["Where is the music room?", "Phòng âm nhạc ở đâu?"],
          ["It's on the second floor.", "Nó ở trên tầng hai."]
        ]
      }
    ]
  },
  {
    id: 7,
    name: "Unit 7: Favourite activities",
    color: "#607D8B",
    vocab: [
      { word: "Singing", meaning: "Ca hát", emoji: "🎤" },
      { word: "Dancing", meaning: "Nhảy múa", emoji: "💃" },
      { word: "Drawing", meaning: "Vẽ tranh", emoji: "✍️" },
      { word: "Playing football", meaning: "Chơi bóng đá", emoji: "⚽" }
    ],
    structures: [
      {
        title: "Hỏi về hoạt động yêu thích",
        formula: "What's your favourite school activity? - It's + [Hoạt động]",
        examples: [
          ["What's your favourite school activity?", "Hoạt động trường học yêu thích của bạn là gì?"],
          ["It's singing English songs.", "Đó là hát các bài hát tiếng Anh."]
        ]
      }
    ]
  },
  {
    id: 8,
    name: "Unit 8: In our classroom",
    color: "#00BCD4",
    vocab: [
      { word: "Dictionary", meaning: "Từ điển", emoji: "📖" },
      { word: "Notebook", meaning: "Vở ghi chép", emoji: "📓" },
      { word: "Pencil case", meaning: "Hộp bút", emoji: "✏️" },
      { word: "Board", meaning: "Cái bảng", emoji: "🏫" }
    ],
    structures: [
      {
        title: "Xin phép làm gì đó",
        formula: "May I + [Hành động]? - Yes, you can. / No, you can't.",
        examples: [
          ["May I borrow your pen?", "Mình có thể mượn bút của bạn không?"],
          ["Yes, you can.", "Được chứ, bạn có thể."]
        ]
      }
    ]
  },
  {
    id: 9,
    name: "Unit 9: Our outdoor activities",
    color: "#8BC34A",
    vocab: [
      { word: "Hide and seek", meaning: "Trốn tìm", emoji: "🙈" },
      { word: "Tug of war", meaning: "Kéo co", emoji: "🧗" },
      { word: "Leapfrog", meaning: "Nhảy ếch", emoji: "🐸" },
      { word: "Roller-skate", meaning: "Trượt patin", emoji: "🛼" }
    ],
    structures: [
      {
        title: "Hỏi ai đó đang làm gì",
        formula: "What are they doing? - They are + [V-ing]",
        examples: [
          ["What are they doing?", "Họ đang làm gì vậy?"],
          ["They are playing tag.", "Họ đang chơi đuổi bắt."]
        ]
      }
    ]
  },
  {
    id: 10,
    name: "Unit 10: Our school trip",
    color: "#FF5722",
    vocab: [
      { word: "Campsite", meaning: "Địa điểm cắm trại", emoji: "⛺" },
      { word: "Forest", meaning: "Khu rừng", emoji: "🌲" },
      { word: "Mountain", meaning: "Ngọn núi", emoji: "⛰️" },
      { word: "Countryside", meaning: "Vùng quê", emoji: "🌾" }
    ],
    structures: [
      {
        title: "Hỏi đã đi đâu vào chuyến dã ngoại",
        formula: "Where did you go on your school trip? - I went to + [Địa điểm]",
        examples: [
          ["Where did you go on your school trip?", "Bạn đã đi đâu vào chuyến dã ngoại của trường?"],
          ["I went to the National Park.", "Mình đã đi đến Công viên Quốc gia."]
        ]
      }
    ]
  }
];