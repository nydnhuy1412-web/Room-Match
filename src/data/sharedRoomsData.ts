import type { Room, User } from '../App';

// Dữ liệu người đang ở trong các phòng shared - Toàn bộ sinh viên 18-25 tuổi
const universities = [
  'ĐH Bách Khoa TP.HCM',
  'ĐH Khoa học Tự nhiên',
  'ĐH Kinh tế TP.HCM',
  'ĐH Y Dược TP.HCM',
  'ĐH Văn Lang',
  'ĐH Tôn Đức Thắng',
  'ĐH Sư phạm TP.HCM',
  'ĐH Ngoại thương',
  'ĐH Công nghệ Thông tin',
  'ĐH Huflit',
];

const yearOfStudies = ['Năm nhất', 'Năm hai', 'Năm ba', 'Năm tư'];

const lifestyles = [
  'Học buổi sáng, chiều làm thêm. Thích đọc sách và nghe nhạc.',
  'Học cả ngày, tối ở nhà tự học. Thích xem phim và nấu ăn.',
  'Học online nhiều, thích yên tĩnh để tập trung.',
  'Học tại trường, chiều tối làm part-time. Cuối tuần về quê.',
  'Học buổi sáng, thích vận động và tập gym.',
  'Thích sạch sẽ, gọn gàng. Thường về nhà đúng giờ.',
  'Sáng học, chiều làm thêm. Tối thích đi cafe với bạn.',
  'Học nhiều, thỉnh thoảng thức khuya ôn thi.',
  'Thích không gian yên tĩnh để học tập và làm bài tập nhóm.',
  'Năng động, thích giao lưu và tham gia hoạt động sinh viên.',
];

const personalities = [
  'Hòa đồng, thân thiện, dễ gần. Không ồn ào.',
  'Điềm tĩnh, tôn trọng không gian chung.',
  'Vui vẻ, hoạt bát, thích học hỏi.',
  'Chăm chỉ, nghiêm túc với học tập.',
  'Năng động, thích giúp đỡ người khác.',
  'Cởi mở, thích trò chuyện và chia sẻ.',
  'Ngăn nắp, có kỷ luật trong sinh hoạt.',
  'Tự lập, biết tự lo cho bản thân.',
  'Thân thiện, hay cười, tạo không khí vui vẻ.',
  'Chín chắn, có trách nhiệm với đồ dùng chung.',
];

// Generate 50 student tenants
const currentTenants: User[] = [];
for (let i = 1; i <= 50; i++) {
  const gender = i % 2 === 0 ? 'Nữ' : 'Nam';
  const firstNames = gender === 'Nữ' 
    ? ['Nguyễn Minh Thư', 'Trần Hồng Nhung', 'Lê Thị Hoa', 'Võ Thị Lan', 'Ngô Thị Mai', 'Phạm Thị Ngọc', 'Cao Thị Phương', 'Mai Thị Thu', 'Dương Thị Tâm', 'Lâm Thị Hà', 'Hoàng Thanh Hà', 'Bùi Thị Linh', 'Đặng Minh Anh', 'Trương Thị Hương', 'Phan Thị Ngọc', 'Vũ Thu Hà', 'Đinh Phương Thảo', 'Lý Thị Hương', 'Tô Thị Lan', 'Nguyễn Kim Chi', 'Trần Thùy Linh', 'Lê Phương Anh', 'Phan Thị Trang', 'Võ Ngọc Hân', 'Cao Minh Châu']
    : ['Trần Văn Hoàng', 'Phạm Quốc Việt', 'Đặng Minh Tuấn', 'Hoàng Văn Nam', 'Bùi Minh Khoa', 'Lý Văn Tài', 'Đinh Văn Đức', 'Vũ Văn Sơn', 'Nguyễn Văn Bình', 'Tô Văn Phúc', 'Lê Quốc Khánh', 'Phan Minh Đức', 'Võ Thanh Tùng', 'Trương Văn Nam', 'Cao Đức Anh', 'Hoàng Minh Tuấn', 'Bùi Văn Hùng', 'Đặng Quốc Bảo', 'Lý Minh Hải', 'Tôvăn Phong', 'Nguyễn Tiến Đạt', 'Trần Duy Khánh', 'Lê Hoàng Long', 'Pham Văn An', 'Võ Minh Quân'];
  
  const name = gender === 'Nữ' ? firstNames[(i / 2) % firstNames.length] : firstNames[Math.floor(i / 2) % firstNames.length];
  const age = 18 + (i % 8); // 18-25 tuổi
  const university = universities[i % universities.length];
  const yearOfStudy = yearOfStudies[i % yearOfStudies.length];
  
  currentTenants.push({
    id: `st${i}`,
    phone: `090${i.toString().padStart(7, '0')}`,
    name,
    age,
    gender,
    occupation: `Sinh viên ${university}`,
    lifestyle: lifestyles[i % lifestyles.length],
    personality: personalities[i % personalities.length],
    preferences: gender === 'Nữ' ? 'Tìm bạn nữ cùng ở, yêu thích sự sạch sẽ.' : 'Tìm người cùng giới, yêu thích sự yên tĩnh.',
    avatar: `https://i.pravatar.cc/150?img=${i}`,
    hasRoom: true,
    university,
    yearOfStudy,
  });
}

const imageUrls = [
  'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYmVkcm9vbXxlbnwxfHx8fDE3NjQ5MDQ0OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1555930112-0159bcdc3fe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb3JtJTIwcm9vbXxlbnwxfHx8fDE3NjQ5MDQ0OTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1728633764783-ce3311e30708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGFyZWQlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY0OTA0NTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1702014862053-946a122b920d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkaW8lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY0ODY1NzgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1615874959474-d609969a20ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJlZHJvb218ZW58MXx8fHwxNzY0OTA0NTAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkZW50JTIwaG91c2luZ3xlbnwxfHx8fDE3NjQ5MDQ1MDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjByb29tfGVufDF8fHx8MTc2NDgzMjM0MXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1611095459865-47682ae3c41c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc2NDgyMjAwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
];

const districts = ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Thủ Đức', 'Bình Thạnh', 'Gò Vấp', 'Tân Bình', 'Phú Nhuận'];
const streets = ['Nguyễn Huệ', 'Lê Lợi', 'Võ Văn Ngân', 'Phan Đăng Lưu', 'Cộng Hòa', 'Quang Trung', 'Hoàng Văn Thụ', 'Phan Xích Long'];

const universityList = ['ĐH Bách Khoa', 'ĐH Khoa học Tự nhiên', 'ĐH Kinh tế TP.HCM', 'ĐH Y Dược TP.HCM', 'ĐH Văn Lang'];

const nearbyPlacesOptions = [
  ['Chợ Bến Thành', 'Công viên 23/9', 'Bệnh viện Chợ Rẫy'],
  ['Chợ An Đông', 'Siêu thị Co.opMart', 'Công viên Lê Văn Tám'],
  ['Chợ Tân Bình', 'TTTM Aeon Mall', 'Sân bay Tân Sơn Nhất'],
  ['Chợ Thủ Đức', 'TTTM Gigamall', 'Công viên phần mềm Quang Trung'],
  ['Chợ Bình Thạnh', 'Vincom Landmark 81', 'Công viên Gia Định'],
  ['Chợ Gò Vấp', 'TTTM Emart', 'Bệnh viện Gò Vấp'],
];

const landlords = [
  { name: 'Chị Lan', phone: '0901234567', responseTime: '5 phút' },
  { name: 'Anh Minh', phone: '0912345678', responseTime: '10 phút' },
  { name: 'Chị Hương', phone: '0923456789', responseTime: '15 phút' },
  { name: 'Anh Tuấn', phone: '0934567890', responseTime: '30 phút' },
  { name: 'Chị Mai', phone: '0945678901', responseTime: '1 giờ' },
];

// Tạo dữ liệu 300 phòng đang tìm người ở ghép
export function generateSharedRooms(): Room[] {
  const rooms: Room[] = [];
  const genderOptions: Array<'Nam' | 'Nữ' | 'Nam nữ'> = ['Nam', 'Nữ', 'Nam nữ'];
  
  // Tăng lên 300 phòng
  for (let i = 1; i <= 300; i++) {
    const district = districts[i % districts.length];
    const hasLoft = Math.random() > 0.7;
    
    // Phòng có từ 2-4 người
    const maxOccupants = i % 3 === 0 ? 4 : (i % 2 === 0 ? 3 : 2);
    
    // Số người đang ở: ít nhất 1 người, tối đa maxOccupants - 1
    const currentOccupants = Math.floor(Math.random() * (maxOccupants - 1)) + 1;
    
    const availableSpots = maxOccupants - currentOccupants;
    
    const area = 20 + Math.floor(Math.random() * 30);
    const floor = Math.floor(Math.random() * 8) + 1;
    
    // Giá làm tròn theo từng khoảng
    let price: number;
    const priceCategory = i % 10;
    if (priceCategory < 2) price = [1500000, 1800000, 2000000][Math.floor(Math.random() * 3)]; // 1.5-2tr
    else if (priceCategory < 4) price = [2000000, 2500000, 3000000][Math.floor(Math.random() * 3)]; // 2-3tr
    else if (priceCategory < 6) price = [3000000, 3500000, 4000000][Math.floor(Math.random() * 3)]; // 3-4tr
    else if (priceCategory < 8) price = [4000000, 4500000, 5000000][Math.floor(Math.random() * 3)]; // 4-5tr
    else if (priceCategory < 9) price = [5000000, 5500000, 6000000, 6500000, 7000000][Math.floor(Math.random() * 5)]; // 5-7tr
    else price = [7000000, 7500000, 8000000][Math.floor(Math.random() * 3)]; // 7-8tr
    
    // Chọn tenants ngẫu nhiên
    const roomTenants: User[] = [];
    const usedTenantIds = new Set<string>();
    
    // Determine room gender based on first tenant
    let roomGender: 'Nam' | 'Nữ' | 'Nam nữ' = 'Nam nữ';
    
    for (let j = 0; j < currentOccupants; j++) {
      let randomTenant;
      do {
        randomTenant = currentTenants[Math.floor(Math.random() * currentTenants.length)];
      } while (usedTenantIds.has(randomTenant.id));
      
      usedTenantIds.add(randomTenant.id);
      roomTenants.push(randomTenant);
      
      // Set room gender based on first tenant
      if (j === 0) {
        // 70% cùng giới, 30% nam nữ
        if (Math.random() < 0.7) {
          roomGender = randomTenant.gender as 'Nam' | 'Nữ';
        }
      }
    }
    
    // Set lookingForGender based on room composition
    let lookingForGender: 'Nam' | 'Nữ' | 'Nam nữ' = roomGender;
    
    const amenitiesOptions = [
      ['WiFi', 'Điều hòa', 'Nước nóng', 'An ninh 24/7'],
      ['WiFi', 'Máy giặt', 'Tủ lạnh', 'Bãi xe'],
      ['WiFi', 'Điều hòa', 'Thang máy', 'An ninh 24/7', 'Bãi xe'],
      ['WiFi', 'Nước nóng', 'Máy giặt', 'Bãi xe'],
      ['WiFi', 'Điều hòa', 'Nước nóng', 'Thang máy', 'Tủ lạnh'],
    ];
    
    const nearbyUniv = i % 3 === 0 ? [universityList[i % universityList.length]] : undefined;
    
    const tags = [];
    if (hasLoft) tags.push('Có gác');
    if (maxOccupants === 1) tags.push('Phòng riêng');
    if (price < 2500000) tags.push('Giá rẻ');
    if (nearbyUniv) tags.push('Gần trường');
    if (availableSpots === 1) tags.push('Còn 1 chỗ');
    
    rooms.push({
      id: `shared-${i}`,
      title: `${hasLoft ? 'Phòng có gác' : 'Phòng'} ${maxOccupants} người - ${district}`,
      address: `${100 + i} ${streets[i % streets.length]}`,
      district,
      city: 'TP. Hồ Chí Minh',
      price,
      maxOccupants,
      currentOccupants,
      area,
      images: [imageUrls[i % imageUrls.length], imageUrls[(i + 1) % imageUrls.length]],
      amenities: amenitiesOptions[i % amenitiesOptions.length],
      description: `Phòng trọ ${area}m² tại ${district}, hiện có ${currentOccupants} người đang ở, còn ${availableSpots} chỗ trống. ${hasLoft ? 'Phòng có gác lửng tiện lợi. ' : ''}Đầy đủ tiện nghi: ${amenitiesOptions[i % amenitiesOptions.length].join(', ')}. Khu vực an ninh, yên tĩnh, gần các tiện ích. Phù hợp cho sinh viên.`,
      tenants: roomTenants,
      availableSpots,
      serviceFees: {
        electricity: 3500 + Math.floor(Math.random() * 500),
        water: 80000 + Math.floor(Math.random() * 20000),
        internet: 50000 + Math.floor(Math.random() * 50000),
        cleaning: i % 3 === 0 ? 50000 : undefined,
      },
      nearbyUniversities: nearbyUniv,
      distanceToUniversity: nearbyUniv ? 1 + Math.random() * 3 : undefined,
      tags,
      rating: 3.5 + Math.random() * 1.5, // Rating từ 3.5 - 5.0
      verified: i % 4 !== 0,
      hasLoft,
      floor,
      nearbyPlaces: nearbyPlacesOptions[i % nearbyPlacesOptions.length],
      landlord: landlords[i % landlords.length],
      mapUrl: `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(streets[i % streets.length] + ', ' + district + ', TP.HCM')}`,
      lookingForGender, // Add gender preference
    });
  }
  
  return rooms;
}

export const sharedRoomsData = generateSharedRooms();
